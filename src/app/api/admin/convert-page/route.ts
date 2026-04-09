import { type NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { convertPage } from '@/lib/page-converter';
import type { ConvertPageRequest } from '@/lib/page-converter/types';

const SRC_ROOT = join(process.cwd(), 'src');

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
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Conversion failed' },
      { status: 500 },
    );
  }
}
