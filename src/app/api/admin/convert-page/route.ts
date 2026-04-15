import { type NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { convertPage } from '@/lib/page-converter';
import type { ConvertPageRequest, ConvertedSectionMeta } from '@/lib/page-converter/types';

const SRC_ROOT = join(process.cwd(), 'src');

// ─── Auto-registration helpers ─────────────────────────────────────────────────

/**
 * Insert a new entry into preview-registry.ts REGISTRY_LOADERS if not already present.
 */
async function registerInPreviewRegistry(pageName: string): Promise<void> {
  const filePath = join(SRC_ROOT, 'lib/converted-pages/preview-registry.ts');
  let src = await readFile(filePath, 'utf8');

  if (src.includes(`'${pageName}'`) || src.includes(`"${pageName}"`)) return;

  const entry = `  '${pageName}': () => import('@/app/(site)/${pageName}/editor-registry'),\n`;
  // Insert before the }; that immediately precedes the first export statement
  src = src.replace(/\n\};\s*\nexport/, `\n${entry}};\nexport`);
  await writeFile(filePath, src, 'utf8');
}

/**
 * Insert a new entry into content-map.ts CONTENT_CONFIG if not already present.
 */
async function registerInContentMap(pageName: string, sections: ConvertedSectionMeta[]): Promise<void> {
  const filePath = join(SRC_ROOT, 'lib/converted-pages/content-map.ts');
  let src = await readFile(filePath, 'utf8');

  if (src.includes(`'${pageName}'`) || src.includes(`"${pageName}"`)) return;

  const sectionLines = sections
    .map((s) => `      { key: '${s.key}', label: '${s.label}', icon: '${s.icon}' },`)
    .join('\n');

  const entry = [
    `  '${pageName}': {`,
    `    pageName: '${pageName}',`,
    `    contentFile: 'src/app/(site)/${pageName}/content.ts',`,
    `    sections: [`,
    sectionLines,
    `    ],`,
    `  },`,
  ].join('\n') + '\n';

  // Insert before the }; that immediately precedes the first export statement
  src = src.replace(/\n\};\s*\nexport/, `\n${entry}};\nexport`);
  await writeFile(filePath, src, 'utf8');
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ConvertPageRequest & { writeFiles?: boolean };

    if (!body.html || !body.pageName || !body.ai) {
      return NextResponse.json({ ok: false, error: 'html, pageName, and ai are required.' }, { status: 400 });
    }

    const result = await convertPage({
      html: body.html,
      pageName: body.pageName,
      ai: body.ai,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 422 });
    }

    // In production (Vercel) we can't write to disk — return files for preview only.
    // When running locally and writeFiles=true, write the files to disk.
    if (body.writeFiles === true && process.env.NODE_ENV !== 'production') {
      for (const file of result.files) {
        const abs = join(SRC_ROOT, file.path);
        await mkdir(join(abs, '..'), { recursive: true });
        await writeFile(abs, file.code, 'utf8');
      }

      // Append CSS additions to globals.css
      if (result.cssAdditions.trim()) {
        const globalsPath = join(SRC_ROOT, 'app', 'globals.css');
        const { appendFile } = await import('node:fs/promises');
        await appendFile(
          globalsPath,
          `\n\n/* ── Page: ${result.pageName} ── */\n${result.cssAdditions}\n`,
          'utf8',
        );
      }

      // Auto-register in preview-registry and content-map so the upload route
      // can find the editor-registry (and its formDefinitions) immediately.
      if (result.sections.length > 0) {
        await Promise.all([
          registerInPreviewRegistry(result.pageName),
          registerInContentMap(result.pageName, result.sections),
        ]);
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Conversion failed' },
      { status: 500 },
    );
  }
}
