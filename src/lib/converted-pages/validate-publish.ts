/**
 * Pre-publish validation for converted-page content.
 *
 * Pure data-only — no React, no DOM, no I/O. Returns a list of issues with
 * severity, code, message, and best-effort dotted path so the editor can
 * surface them to marketing before they hit "Publish".
 *
 * Block issues prevent publishing; warnings are advisory.
 *
 * See {@link validateConvertedPagePublish} for the rules implemented.
 */

import {
  SECTION_ORDER_KEY,
  SECTION_INSTANCES_KEY,
  DELETED_SECTIONS_KEY,
} from './editor-adapter';

export type ValidationIssue = {
  severity: 'block' | 'warn';
  code: string;
  message: string;
  path?: string;
  sectionKey?: string;
};

export type ValidationResult = {
  blocks: ValidationIssue[];
  warnings: ValidationIssue[];
  canPublish: boolean;
};

const DEFAULT_SUSPICIOUS_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'staging.',
  '.local',
  'lvh.me',
  'ngrok.io',
];

const MEDIA_OBJECT_KEYS = new Set([
  'id',
  'mediaId',
  'url',
  'src',
  'alt',
  'filename',
  'width',
  'height',
  'mimeType',
  'filesize',
]);

const IMAGE_NAME_PATTERN =
  /^(image|logo|photo|avatar|bg|background|backgroundImage|mapImage|thumbnail)$/i;

const URL_KEY_PATTERN = /^(href|url)$/i;
const CTA_LIKE_PATH_TAIL = /(^|\.)([a-z0-9_]*cta|cta)$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMediaObject(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  return keys.every((key) => MEDIA_OBJECT_KEYS.has(key));
}

/** Editor metadata keys never to traverse into. */
function isReservedKey(key: string): boolean {
  if (key.startsWith('__')) return true;
  if (key === '_sectionOverrides') return true;
  if (key === 'editor') return true;
  return false;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

type LeafVisit = {
  path: string;
  value: unknown;
  parent: Record<string, unknown> | unknown[] | null;
  key: string | number | null;
};

type ObjectVisit = {
  path: string;
  value: Record<string, unknown>;
};

/**
 * Walk the tree, calling {@link onLeaf} for every primitive leaf and every
 * media-object leaf (we don't descend into media objects). Calls
 * {@link onObject} for every plain (non-media) object encountered, including
 * the root.
 *
 * Skips reserved meta keys ({@link isReservedKey}) at every depth.
 */
function walk(
  root: unknown,
  onLeaf: (visit: LeafVisit) => void,
  onObject: (visit: ObjectVisit) => void,
): void {
  function recur(
    value: unknown,
    path: string,
    parent: Record<string, unknown> | unknown[] | null,
    key: string | number | null,
  ): void {
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        recur(item, path ? `${path}.${idx}` : String(idx), value, idx);
      });
      return;
    }
    if (isMediaObject(value)) {
      onLeaf({ path, value, parent, key });
      return;
    }
    if (isPlainObject(value)) {
      onObject({ path, value });
      for (const [k, v] of Object.entries(value)) {
        if (isReservedKey(k)) continue;
        recur(v, path ? `${path}.${k}` : k, value, k);
      }
      return;
    }
    onLeaf({ path, value, parent, key });
  }
  recur(root, '', null, null);
}

function joinPath(base: string, key: string): string {
  return base ? `${base}.${key}` : key;
}

function isInternalOrSpecialUrl(value: string): boolean {
  return (
    value.startsWith('/') ||
    value.startsWith('#') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:')
  );
}

function classifyUrlString(
  value: string,
):
  | { kind: 'ok'; hostname?: string }
  | { kind: 'malformed_external' }
  | { kind: 'malformed_mailto' }
  | { kind: 'malformed_tel' }
  | { kind: 'internal' } {
  const trimmed = value.trim();
  if (!trimmed) return { kind: 'ok' };

  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return { kind: 'internal' };
  }

  if (trimmed.startsWith('mailto:')) {
    const body = trimmed.slice('mailto:'.length);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body)) {
      return { kind: 'malformed_mailto' };
    }
    return { kind: 'ok' };
  }

  if (trimmed.startsWith('tel:')) {
    const body = trimmed.slice('tel:'.length);
    const stripped = body.replace(/[\d+\-()\s]/g, '');
    if (stripped.length > 0) return { kind: 'malformed_tel' };
    return { kind: 'ok' };
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return { kind: 'ok', hostname: parsed.hostname };
    } catch {
      return { kind: 'malformed_external' };
    }
  }

  // No recognized scheme. If it contains a dot but isn't a relative path,
  // treat as a malformed external URL (e.g. `example.com/foo`,
  // `www.example.com`).
  if (trimmed.includes('.')) {
    return { kind: 'malformed_external' };
  }

  // Otherwise (no scheme, no dot, not /, not #) — too ambiguous to flag.
  return { kind: 'ok' };
}

function pathParent(path: string): string {
  const idx = path.lastIndexOf('.');
  return idx === -1 ? '' : path.slice(0, idx);
}

function pathTail(path: string): string {
  const idx = path.lastIndexOf('.');
  return idx === -1 ? path : path.slice(idx + 1);
}

function sectionKeyFromPath(path: string): string | undefined {
  if (!path) return undefined;
  const head = path.split('.')[0];
  return head || undefined;
}

/**
 * Validate a converted-page content object before publishing. Returns
 * structured issues split into `blocks` (must fix) and `warnings` (advisory).
 *
 * Detection summary:
 *   - CTA pair integrity (label without url and vice versa) — both
 *     object-shape (`{label, href}`) and path-shape (`*Cta.label` next to
 *     `*Cta.href`).
 *   - Malformed URLs at any `href|url` leaf: external URLs must parse, bare
 *     hostnames are flagged, mailto/tel get shape checks.
 *   - Media objects with a `url` but empty `alt`, plus string-shaped image
 *     fields (`image|logo|...`) when there is an empty companion `*Alt` /
 *     sibling `alt`. String images with no alt companion are decorative-only
 *     and skipped.
 *   - Section meta: hidden sections, soft-deleted sections, duplicate
 *     instances all surface as warnings so marketing notices left-behind state.
 *   - Hostnames matching `options.suspiciousDomains` warn (catches staging /
 *     localhost URLs left over from imports).
 */
export function validateConvertedPagePublish(
  content: Record<string, unknown> | null | undefined,
  options?: { suspiciousDomains?: string[] },
): ValidationResult {
  const blocks: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!content || !isPlainObject(content)) {
    return { blocks, warnings, canPublish: true };
  }

  const suspicious = options?.suspiciousDomains ?? DEFAULT_SUSPICIOUS_DOMAINS;

  // ── Section-level meta warnings (read directly off content root) ─────────
  const deleted = content[DELETED_SECTIONS_KEY];
  if (Array.isArray(deleted) && deleted.length > 0) {
    const keys = deleted.filter((v): v is string => typeof v === 'string');
    if (keys.length > 0) {
      warnings.push({
        severity: 'warn',
        code: 'deleted_sections',
        message: `${keys.length} soft-deleted section(s) still in content: ${keys.join(', ')}. Their data will not render but is preserved.`,
        path: DELETED_SECTIONS_KEY,
      });
    }
  }

  const instances = content[SECTION_INSTANCES_KEY];
  if (isPlainObject(instances) && Object.keys(instances).length > 0) {
    const counts = new Map<string, number>();
    for (const meta of Object.values(instances)) {
      if (isPlainObject(meta) && typeof meta.templateKey === 'string') {
        counts.set(meta.templateKey, (counts.get(meta.templateKey) ?? 0) + 1);
      }
    }
    if (counts.size > 0) {
      const summary = Array.from(counts.entries())
        .map(([k, n]) => `${k} (+${n})`)
        .join(', ');
      warnings.push({
        severity: 'warn',
        code: 'duplicate_sections',
        message: `Duplicate section instances present: ${summary}.`,
        path: SECTION_INSTANCES_KEY,
      });
    }
  }

  // Per-section `__hidden` flag.
  for (const [sectionKey, sectionVal] of Object.entries(content)) {
    if (isReservedKey(sectionKey)) continue;
    if (sectionKey === SECTION_ORDER_KEY) continue;
    if (!isPlainObject(sectionVal)) continue;
    if (sectionVal['__hidden'] === true) {
      warnings.push({
        severity: 'warn',
        code: 'section_hidden',
        message: `Section "${sectionKey}" is hidden and will not render on the live site.`,
        path: `${sectionKey}.__hidden`,
        sectionKey,
      });
    }
  }

  // ── Walk content for leaf-level URL / image checks and gather objects ────
  const objectsWithCtaShape: Array<{ path: string; obj: Record<string, unknown> }> = [];

  walk(
    content,
    (leaf) => {
      const { path, value } = leaf;
      if (!path) return;

      // String image-name fields with companion alt.
      if (typeof value === 'string' && value.trim().length > 0) {
        const tail = pathTail(path);
        const parentPath = pathParent(path);
        const parent = leaf.parent;

        // Image-string + empty alt companion → warn.
        if (
          IMAGE_NAME_PATTERN.test(tail) &&
          isPlainObject(parent)
        ) {
          const altCompanionKey = `${tail}Alt`;
          const hasNamedAlt = altCompanionKey in parent;
          const hasSiblingAlt = 'alt' in parent && tail !== 'alt';
          if (hasNamedAlt || hasSiblingAlt) {
            const altVal = hasNamedAlt ? parent[altCompanionKey] : parent['alt'];
            if (!nonEmptyString(altVal)) {
              warnings.push({
                severity: 'warn',
                code: 'image_missing_alt',
                message: `Image "${path}" has no alt text. Add a description for screen readers.`,
                path,
                sectionKey: sectionKeyFromPath(path),
              });
            }
          }
        }

        // URL leaf checks (href|url tail).
        if (URL_KEY_PATTERN.test(tail)) {
          const cls = classifyUrlString(value);
          if (cls.kind === 'malformed_external') {
            blocks.push({
              severity: 'block',
              code: 'malformed_external_url',
              message: `"${value}" at ${path} is not a valid URL. Use a full https:// link or an internal path starting with "/".`,
              path,
              sectionKey: sectionKeyFromPath(path),
            });
          } else if (cls.kind === 'malformed_mailto') {
            blocks.push({
              severity: 'block',
              code: 'malformed_mailto',
              message: `"${value}" at ${path} is not a valid mailto address.`,
              path,
              sectionKey: sectionKeyFromPath(path),
            });
          } else if (cls.kind === 'malformed_tel') {
            blocks.push({
              severity: 'block',
              code: 'malformed_tel',
              message: `"${value}" at ${path} is not a valid tel: link. Use digits, +, -, (), and spaces only.`,
              path,
              sectionKey: sectionKeyFromPath(path),
            });
          } else if (cls.kind === 'ok' && cls.hostname) {
            // External http/https — check suspicious-domain list.
            const host = cls.hostname.toLowerCase();
            const matched = suspicious.find((needle) => host.includes(needle.toLowerCase()));
            if (matched) {
              warnings.push({
                severity: 'warn',
                code: 'suspicious_external_url',
                message: `URL ${value} at ${path} points to "${cls.hostname}" which looks like a staging or local hostname.`,
                path,
                sectionKey: sectionKeyFromPath(path),
              });
            }
          }
          // Path-style CTA pair checks happen in the object pass below.
        }
      }

      // Media-object leaf checks: missing alt.
      if (isMediaObject(value)) {
        const url = value['url'] ?? value['src'];
        const alt = value['alt'];
        if (nonEmptyString(url) && !nonEmptyString(alt)) {
          warnings.push({
            severity: 'warn',
            code: 'image_missing_alt',
            message: `Image at ${path} has no alt text. Add a description for screen readers.`,
            path,
            sectionKey: sectionKeyFromPath(path),
          });
        }
      }
    },
    (objVisit) => {
      const { path, value } = objVisit;
      // Skip media objects (already handled as leaves).
      if (isMediaObject(value)) return;

      const hasLabel = 'label' in value;
      const hasHref = 'href' in value;
      const hasUrl = 'url' in value;

      if (hasLabel && (hasHref || hasUrl)) {
        objectsWithCtaShape.push({ path, obj: value });
      } else if (CTA_LIKE_PATH_TAIL.test(path) && (hasLabel || hasHref || hasUrl)) {
        // Cta-named subtree where one half is missing the other entirely.
        objectsWithCtaShape.push({ path, obj: value });
      }
    },
  );

  // ── CTA pair integrity ──────────────────────────────────────────────────
  for (const { path, obj } of objectsWithCtaShape) {
    const labelRaw = obj['label'];
    const hrefRaw = obj['href'] ?? obj['url'];
    const labelKey = 'label';
    const urlKey = 'href' in obj ? 'href' : 'url' in obj ? 'url' : 'href';

    const hasLabel = nonEmptyString(labelRaw);
    const hasUrl = nonEmptyString(hrefRaw);
    const labelPresent = 'label' in obj;
    const urlPresent = 'href' in obj || 'url' in obj;

    // label set but url missing/empty
    if (hasLabel && !hasUrl) {
      blocks.push({
        severity: 'block',
        code: 'cta_label_without_url',
        message: `CTA at ${path || '(root)'} has a label "${String(labelRaw).trim()}" but no link URL.`,
        path: joinPath(path, urlKey),
        sectionKey: sectionKeyFromPath(path),
      });
    }
    // url set but label missing/empty
    if (hasUrl && !hasLabel && labelPresent) {
      blocks.push({
        severity: 'block',
        code: 'cta_url_without_label',
        message: `CTA at ${path || '(root)'} has a link URL but no visible label.`,
        path: joinPath(path, labelKey),
        sectionKey: sectionKeyFromPath(path),
      });
    }
    // CTA-named subtree with one half missing entirely.
    if (CTA_LIKE_PATH_TAIL.test(path)) {
      if (labelPresent && !urlPresent && hasLabel) {
        blocks.push({
          severity: 'block',
          code: 'cta_label_without_url',
          message: `CTA at ${path} has a label "${String(labelRaw).trim()}" but no link URL field.`,
          path: joinPath(path, 'href'),
          sectionKey: sectionKeyFromPath(path),
        });
      }
      if (urlPresent && !labelPresent && hasUrl) {
        blocks.push({
          severity: 'block',
          code: 'cta_url_without_label',
          message: `CTA at ${path} has a link URL but no label field.`,
          path: joinPath(path, 'label'),
          sectionKey: sectionKeyFromPath(path),
        });
      }
    }
  }

  // Snapshot canPublish into a plain boolean for the returned object.
  return { blocks, warnings, canPublish: blocks.length === 0 };
}
