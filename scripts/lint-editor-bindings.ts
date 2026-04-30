/**
 * lint-editor-bindings.ts
 *
 * Static lint that ensures every renderable copy field declared in a converted
 * page's `content.ts` (under `src/app/(site)/<page>/`) has a matching
 * `getConvertedNodeBinding` (or `getConvertedImageBinding`) call in the
 * page's section components.
 *
 * Why: the visual editor depends entirely on those bindings. Without them,
 * inline edits silently no-op. There's no automated check for this otherwise.
 *
 * Usage:
 *   npm run lint:editor
 *
 * Exit codes:
 *   0 — no MISSING bindings (STALE warnings allowed)
 *   1 — at least one MISSING binding
 *
 * Approach:
 *   - Use the TypeScript compiler API directly (already a dep; no ts-morph).
 *   - Parse `content.ts` and walk `defaultContent`'s object literal to enumerate
 *     every leaf string path. Convert array indices to `*` for matching.
 *   - Parse the `editor-registry.ts` to discover section keys + component imports.
 *   - For each section component, statically scan calls to
 *     `getConvertedNodeBinding(<arg>, { field: '<path>' ... })` and
 *     `getConvertedImageBinding(<arg>, { field: '<path>' ... })`. Convert
 *     `${expr}` template segments to `*` for matching.
 *   - Diff: any content leaf with no covering binding → MISSING. Any binding
 *     with no covering content leaf → STALE.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'src', 'app', '(site)');

// ── Field-skip rules ────────────────────────────────────────────────────────

/** Final-segment names that are internal identifiers, not user copy. */
const SKIP_LEAF_NAMES = new Set([
  'slug',
  'id',
  'anchor',
  'key',
  'kind',
  'type',
  'sectionType',
  'source',
  'sourceCategory',
  'sourceTag',
  'align',
  'accent',
  'color',
  'variant',
  'iconColor',
  'tone',
  'layout',
  'mode',
]);

/** Leaf-name suffixes that point at URLs / asset paths — editable via inspector text input. */
const SKIP_URL_SUFFIXES = ['href', 'url', 'src', 'embedurl'];

/** Image-shaped leaves — covered separately by `getConvertedImageBinding`. */
const IMAGE_LEAF_NAMES = new Set(['image', 'logo', 'mapImage', 'icon', 'avatar', 'photo']);

// Anything inside `editor.*` is editor metadata, not user copy.
const EDITOR_META_PREFIX = 'editor';

// ── Self-test ───────────────────────────────────────────────────────────────

function selfTest() {
  // path-flattening sanity (the *real* function lives below; here we just
  // assert the matching algorithm against synthetic inputs).
  const synthetic = {
    contentLeaves: ['hero.title', 'items.0.title', 'items.0.cta.label', 'items.1.title'],
    bindings: ['hero.title', 'items.${i}.title', 'items.${i}.cta.label'],
  };
  const wildBindings = synthetic.bindings.map((b) => b.replace(/\$\{[^}]+\}/g, '*'));
  const wildContent = synthetic.contentLeaves.map((c) => c.replace(/\.\d+(?=\.|$)/g, '.*'));
  const covered = wildContent.every((c) => wildBindings.some((b) => b === c));
  if (!covered) throw new Error('self-test: ${i} ↔ array-index matching broken');
  // sanitize to '*' on both sides
  if (!('items.*.title' === 'items.0.title'.replace(/\.\d+(?=\.|$)/g, '.*'))) throw new Error('index→* failed');
  if (!('items.*.title' === 'items.${i}.title'.replace(/\$\{[^}]+\}/g, '*'))) throw new Error('tpl→* failed');
}
selfTest();

// ── Helpers ─────────────────────────────────────────────────────────────────

function readFile(file: string): string {
  return fs.readFileSync(file, 'utf8');
}

function makeSourceFile(file: string): ts.SourceFile {
  return ts.createSourceFile(file, readFile(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/** Strip leading "as const", "satisfies X", parenthesized expressions. */
function unwrap(node: ts.Expression): ts.Expression {
  let cur: ts.Expression = node;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (ts.isParenthesizedExpression(cur)) cur = cur.expression;
    else if (ts.isAsExpression(cur)) cur = cur.expression;
    else if (ts.isSatisfiesExpression(cur)) cur = cur.expression;
    else if (ts.isTypeAssertionExpression(cur)) cur = cur.expression;
    else break;
  }
  return cur;
}

/** Find the right-hand side of `export const defaultContent = …`. */
function findDefaultContentInitializer(
  src: ts.SourceFile,
): { init: ts.Expression; line: number } | null {
  for (const stmt of src.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExport = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      if (decl.name.text !== 'defaultContent') continue;
      if (!decl.initializer) continue;
      const { line } = src.getLineAndCharacterOfPosition(decl.getStart(src));
      return { init: unwrap(decl.initializer), line: line + 1 };
    }
  }
  return null;
}

/**
 * Resolve the value an identifier was bound to within this source file
 * (handles `import { homepageContent } from '...';` indirections by
 * returning null — caller should follow imports separately).
 *
 * For our use: defaultContent often re-exports from `@/lib/...`. When we hit
 * an Identifier we'll follow the import to its source module.
 */

function resolveIdentifierToObjectLiteral(
  src: ts.SourceFile,
  name: string,
  visitedFiles: Set<string>,
): { node: ts.ObjectLiteralExpression; sourceFile: ts.SourceFile } | null {
  // Look for: const NAME = { … }; (possibly with `as const`/satisfies)
  for (const stmt of src.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      if (decl.name.text !== name) continue;
      if (!decl.initializer) continue;
      const init = unwrap(decl.initializer);
      if (ts.isObjectLiteralExpression(init)) return { node: init, sourceFile: src };
      if (ts.isIdentifier(init)) {
        return resolveIdentifierToObjectLiteral(src, init.text, visitedFiles);
      }
    }
  }
  // Look for: import { NAME } from '...'; — follow it.
  for (const stmt of src.statements) {
    if (!ts.isImportDeclaration(stmt)) continue;
    if (!stmt.importClause?.namedBindings) continue;
    if (!ts.isNamedImports(stmt.importClause.namedBindings)) continue;
    const match = stmt.importClause.namedBindings.elements.find((e) => e.name.text === name);
    if (!match) continue;
    const importedName = match.propertyName?.text ?? match.name.text;
    const moduleSpec = stmt.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpec)) continue;
    const resolved = resolveModuleSpecifier(src.fileName, moduleSpec.text);
    if (!resolved) continue;
    if (visitedFiles.has(resolved)) return null;
    visitedFiles.add(resolved);
    const nextSrc = makeSourceFile(resolved);
    return resolveIdentifierToObjectLiteral(nextSrc, importedName, visitedFiles);
  }
  return null;
}

function resolveModuleSpecifier(fromFile: string, spec: string): string | null {
  let candidate: string | null = null;
  if (spec.startsWith('@/')) {
    candidate = path.join(ROOT, 'src', spec.slice(2));
  } else if (spec.startsWith('./') || spec.startsWith('../')) {
    candidate = path.join(path.dirname(fromFile), spec);
  } else {
    return null;
  }
  for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const tryPath = candidate + ext;
    if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) return tryPath;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  return null;
}

// ── Walk the defaultContent literal, enumerate leaf paths ───────────────────

type Leaf = {
  /** Path relative to the section key root (e.g. for content.main.foo, it's "foo"). */
  fieldPath: string;
  /** Path with array indices replaced by `*` for matching. */
  matchPath: string;
  /** Section key (top-level property of defaultContent), e.g. "hero". */
  sectionKey: string;
  /** Line in content.ts where the leaf is defined. */
  line: number;
  /** True if this looks like an image leaf (covered by image binding). */
  isImage: boolean;
};

function isStringLikeLiteral(node: ts.Expression): boolean {
  return (
    ts.isStringLiteralLike(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isTemplateExpression(node)
  );
}

function shouldSkipLeaf(leafName: string): { skip: boolean; isImage: boolean } {
  if (SKIP_LEAF_NAMES.has(leafName)) return { skip: true, isImage: false };
  const lower = leafName.toLowerCase();
  for (const suf of SKIP_URL_SUFFIXES) {
    if (lower.endsWith(suf)) return { skip: true, isImage: false };
  }
  if (IMAGE_LEAF_NAMES.has(leafName)) return { skip: false, isImage: true };
  // Heuristic image detection: anything containing "image" tail
  if (lower.endsWith('image') || lower.endsWith('logo') || lower.endsWith('photo') || lower.endsWith('avatar')) {
    return { skip: false, isImage: true };
  }
  return { skip: false, isImage: false };
}

function enumerateLeaves(
  obj: ts.ObjectLiteralExpression,
  ownerSrc: ts.SourceFile,
): Leaf[] {
  const out: Leaf[] = [];

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    let keyName: string | null = null;
    if (ts.isIdentifier(prop.name)) keyName = prop.name.text;
    else if (ts.isStringLiteral(prop.name)) keyName = prop.name.text;
    if (!keyName) continue;
    if (keyName === EDITOR_META_PREFIX) continue;
    if (keyName === 'meta') continue; // <meta> is not rendered through bindings

    const sectionKey = keyName;
    const init = unwrap(prop.initializer);
    if (!ts.isObjectLiteralExpression(init)) {
      // Non-object section — treat the section key itself as a leaf.
      if (isStringLikeLiteral(init)) {
        const { skip, isImage } = shouldSkipLeaf(sectionKey);
        if (!skip) {
          const { line } = ownerSrc.getLineAndCharacterOfPosition(prop.getStart(ownerSrc));
          out.push({
            sectionKey,
            fieldPath: '',
            matchPath: '',
            line: line + 1,
            isImage,
          });
        }
      }
      continue;
    }

    // Walk into this section
    walk(init, [], sectionKey, out, ownerSrc);
  }

  return out;
}

function walk(
  node: ts.Expression,
  pathSegs: string[],
  sectionKey: string,
  out: Leaf[],
  ownerSrc: ts.SourceFile,
) {
  const cur = unwrap(node);

  if (ts.isObjectLiteralExpression(cur)) {
    for (const prop of cur.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      let keyName: string | null = null;
      if (ts.isIdentifier(prop.name)) keyName = prop.name.text;
      else if (ts.isStringLiteral(prop.name)) keyName = prop.name.text;
      if (!keyName) continue;
      if (keyName === EDITOR_META_PREFIX) continue;
      walk(prop.initializer, [...pathSegs, keyName], sectionKey, out, ownerSrc);
    }
    return;
  }

  if (ts.isArrayLiteralExpression(cur)) {
    // Inspect first element only (schema sample).
    const first = cur.elements[0];
    if (!first || ts.isOmittedExpression(first)) return;
    walk(first as ts.Expression, [...pathSegs, '0'], sectionKey, out, ownerSrc);
    return;
  }

  // String leaf
  if (isStringLikeLiteral(cur)) {
    if (pathSegs.length === 0) return;
    const leafName = pathSegs[pathSegs.length - 1];
    const { skip, isImage } = shouldSkipLeaf(leafName);
    if (skip) return;
    const fieldPath = pathSegs.join('.');
    const matchPath = fieldPath.replace(/\.\d+(?=\.|$)/g, '.*').replace(/^\d+(?=\.|$)/, '*');
    const { line } = ownerSrc.getLineAndCharacterOfPosition(cur.getStart(ownerSrc));
    out.push({ sectionKey, fieldPath, matchPath, line: line + 1, isImage });
    return;
  }

  // Numbers, booleans, etc. → not user copy.
}

// ── Editor registry parsing ─────────────────────────────────────────────────

type SectionEntry = {
  key: string;
  componentImport: string; // module specifier from `import X from '...'`
  componentName: string;
};

function parseEditorRegistry(file: string): SectionEntry[] | null {
  if (!fs.existsSync(file)) return null;
  const src = makeSourceFile(file);

  // Map of imported component name → module specifier
  const imports = new Map<string, string>();
  for (const stmt of src.statements) {
    if (!ts.isImportDeclaration(stmt)) continue;
    if (!stmt.importClause) continue;
    const moduleSpec = stmt.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpec)) continue;
    if (stmt.importClause.name) {
      imports.set(stmt.importClause.name.text, moduleSpec.text);
    }
    if (stmt.importClause.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)) {
      for (const el of stmt.importClause.namedBindings.elements) {
        imports.set(el.name.text, moduleSpec.text);
      }
    }
  }

  // Find the registry initializer
  const registry = resolveIdentifierToObjectLiteral(src, 'registry', new Set([file]));
  if (!registry) return null;
  const sectionsProp = registry.node.properties.find(
    (p): p is ts.PropertyAssignment =>
      ts.isPropertyAssignment(p) &&
      ((ts.isIdentifier(p.name) && p.name.text === 'sections') ||
        (ts.isStringLiteral(p.name) && p.name.text === 'sections')),
  );
  if (!sectionsProp) return null;
  const arr = unwrap(sectionsProp.initializer);
  if (!ts.isArrayLiteralExpression(arr)) return null;

  const out: SectionEntry[] = [];
  for (const el of arr.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    let key: string | null = null;
    let componentName: string | null = null;
    for (const prop of el.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : null;
      if (!name) continue;
      const value = unwrap(prop.initializer);
      if (name === 'key') {
        if (ts.isStringLiteralLike(value)) key = value.text;
      } else if (name === 'Component') {
        // `Component: Hero as never` — already unwrapped.
        if (ts.isIdentifier(value)) componentName = value.text;
      }
    }
    if (key && componentName) {
      const importSpec = imports.get(componentName);
      if (importSpec) {
        out.push({ key, componentName, componentImport: importSpec });
      }
    }
  }
  return out;
}

// ── Component scanning ──────────────────────────────────────────────────────

type BindingHit = {
  field: string;
  /** Field with template-${} segments converted to `*`. */
  matchField: string;
  isImage: boolean;
  file: string;
  line: number;
};

function scanComponentForBindings(file: string): BindingHit[] {
  if (!fs.existsSync(file)) return [];
  const src = makeSourceFile(file);
  const out: BindingHit[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      const isNode = name === 'getConvertedNodeBinding';
      const isImage = name === 'getConvertedImageBinding';
      if ((isNode || isImage) && node.arguments.length >= 2) {
        const optsArg = node.arguments[1];
        if (ts.isObjectLiteralExpression(optsArg)) {
          for (const prop of optsArg.properties) {
            if (!ts.isPropertyAssignment(prop)) continue;
            const propName = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : null;
            if (propName !== 'field') continue;
            const fieldVal = unwrap(prop.initializer);
            let field: string | null = null;
            if (ts.isStringLiteralLike(fieldVal)) {
              field = fieldVal.text;
            } else if (ts.isTemplateExpression(fieldVal)) {
              // Reconstruct: head + (`${expr}` + chunk)
              field = fieldVal.head.text;
              for (const span of fieldVal.templateSpans) {
                field += '${i}';
                field += span.literal.text;
              }
            } else if (ts.isNoSubstitutionTemplateLiteral(fieldVal)) {
              field = fieldVal.text;
            }
            if (field !== null) {
              const matchField = field.replace(/\$\{[^}]+\}/g, '*');
              const { line } = src.getLineAndCharacterOfPosition(prop.getStart(src));
              out.push({ field, matchField, isImage, file, line: line + 1 });
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(src);
  return out;
}

function resolveComponentFile(
  pageDir: string,
  importSpec: string,
): string | null {
  let candidate: string | null = null;
  if (importSpec.startsWith('@/')) {
    candidate = path.join(ROOT, 'src', importSpec.slice(2));
  } else if (importSpec.startsWith('./') || importSpec.startsWith('../')) {
    candidate = path.join(pageDir, importSpec);
  } else {
    return null;
  }
  for (const ext of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const tryPath = candidate + ext;
    if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) return tryPath;
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────────────────────

type PageReport = {
  page: string;
  missing: Array<{ section: string; fieldPath: string; contentLine: number; componentFiles: string[] }>;
  stale: Array<{ section: string; fieldPath: string; file: string; line: number }>;
};

function lintPage(pageDir: string): PageReport | null {
  const pageName = path.basename(pageDir);
  const contentFile = path.join(pageDir, 'content.ts');
  const registryFile = path.join(pageDir, 'editor-registry.ts');

  if (!fs.existsSync(contentFile)) return null;

  // Parse content.ts → leaves grouped by section key
  const contentSrc = makeSourceFile(contentFile);
  const found = findDefaultContentInitializer(contentSrc);
  if (!found) {
    console.warn(`[lint:editor] WARN  ${pageName}: content.ts does not export defaultContent — skipping.`);
    return null;
  }

  let rootObj: ts.ObjectLiteralExpression | null = null;
  let rootSrc: ts.SourceFile = contentSrc;
  if (ts.isObjectLiteralExpression(found.init)) {
    rootObj = found.init;
  } else if (ts.isIdentifier(found.init)) {
    const visited = new Set<string>([contentFile]);
    const resolved = resolveIdentifierToObjectLiteral(contentSrc, found.init.text, visited);
    if (resolved) {
      rootObj = resolved.node;
      rootSrc = resolved.sourceFile;
    }
  }
  if (!rootObj) {
    console.warn(`[lint:editor] WARN  ${pageName}: could not resolve defaultContent literal — skipping.`);
    return null;
  }

  const leaves = enumerateLeaves(rootObj, rootSrc);

  // Parse editor-registry.ts → list of section components
  const registry = parseEditorRegistry(registryFile);
  if (!registry) {
    console.warn(`[lint:editor] WARN  ${pageName}: no editor-registry.ts (or unreadable) — skipping bindings check.`);
    return null;
  }

  const sectionToFiles = new Map<string, string[]>();
  const sectionToBindings = new Map<string, BindingHit[]>();
  for (const entry of registry) {
    const file = resolveComponentFile(pageDir, entry.componentImport);
    if (!file) continue;
    sectionToFiles.set(entry.key, [file]);
    sectionToBindings.set(entry.key, scanComponentForBindings(file));
  }

  const report: PageReport = { page: pageName, missing: [], stale: [] };

  // MISSING: each leaf path with no covering binding
  for (const leaf of leaves) {
    const files = sectionToFiles.get(leaf.sectionKey);
    if (!files) continue; // Section not in registry — not actionable here.
    const bindings = sectionToBindings.get(leaf.sectionKey) ?? [];
    const covered = bindings.some((b) => {
      if (leaf.isImage && !b.isImage) return false;
      if (!leaf.isImage && b.isImage) return false;
      return b.matchField === leaf.matchPath;
    });
    if (!covered) {
      report.missing.push({
        section: leaf.sectionKey,
        fieldPath: leaf.fieldPath,
        contentLine: leaf.line,
        componentFiles: files,
      });
    }
  }

  // STALE: each binding with no matching content path
  for (const [sectionKey, bindings] of sectionToBindings) {
    const sectionLeaves = leaves.filter((l) => l.sectionKey === sectionKey);
    for (const b of bindings) {
      const matched = sectionLeaves.some((l) => l.matchPath === b.matchField);
      if (!matched) {
        report.stale.push({ section: sectionKey, fieldPath: b.field, file: b.file, line: b.line });
      }
    }
  }

  return report;
}

function relPath(p: string): string {
  return path.relative(ROOT, p);
}

function main() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error(`[lint:editor] (site) dir not found at ${SITE_DIR}`);
    process.exit(2);
  }

  const pageDirs = fs
    .readdirSync(SITE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(SITE_DIR, d.name));

  const reports: PageReport[] = [];
  for (const dir of pageDirs) {
    const rep = lintPage(dir);
    if (rep) reports.push(rep);
  }

  let totalMissing = 0;
  let totalStale = 0;
  const perPage: string[] = [];

  for (const rep of reports) {
    for (const m of rep.missing) {
      const files = m.componentFiles.map(relPath).join(', ');
      console.log(
        `MISSING BINDING  ${rep.page}::${m.section}::${m.fieldPath}  (defined in ${relPath(
          path.join(SITE_DIR, rep.page, 'content.ts'),
        )}:${m.contentLine}, no matching call in ${files})`,
      );
    }
    for (const s of rep.stale) {
      console.log(
        `STALE BINDING    ${rep.page}::${s.section}::${s.fieldPath}  (in ${relPath(s.file)}:${s.line}, not in content.ts)`,
      );
    }
    totalMissing += rep.missing.length;
    totalStale += rep.stale.length;
    perPage.push(`${rep.page}: ${rep.missing.length} MISSING, ${rep.stale.length} STALE`);
  }

  console.log('');
  console.log('── lint:editor summary ──');
  for (const line of perPage) console.log('  ' + line);
  console.log(`  TOTAL: ${totalMissing} MISSING, ${totalStale} STALE`);

  if (totalMissing > 0) process.exit(1);
}

main();
