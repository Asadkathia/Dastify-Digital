import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SITE_DIR = path.resolve(process.cwd(), 'src/app/(site)');

// Directories that are part of the framework, not converted pages
const EXCLUDED = new Set([
  '[...slug]',
  'page-editor-preview',
  'converted-preview',
  'legacy-preview',
  'services',
  'blog',
  'case-studies',
]);

function isConvertedPage(name: string): boolean {
  if (EXCLUDED.has(name)) return false;
  const pageDir = path.join(SITE_DIR, name);
  return (
    fs.existsSync(path.join(pageDir, 'content.ts')) ||
    fs.existsSync(path.join(pageDir, 'editor-registry.ts')) ||
    fs.existsSync(path.join(pageDir, 'components'))
  );
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { pageName?: string };
    const pageName = body.pageName?.trim() || '';

    if (!pageName) {
      return NextResponse.json({ ok: false, error: 'pageName is required.' }, { status: 400 });
    }

    if (EXCLUDED.has(pageName)) {
      return NextResponse.json({ ok: false, error: 'Cannot delete a framework directory.' }, { status: 403 });
    }

    if (!isConvertedPage(pageName)) {
      return NextResponse.json({ ok: false, error: 'Not a converted page directory.' }, { status: 404 });
    }

    const pageDir = path.join(SITE_DIR, pageName);
    fs.rmSync(pageDir, { recursive: true, force: true });

    return NextResponse.json({ ok: true, deleted: pageName });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = fs.readdirSync(SITE_DIR, { withFileTypes: true });

    const pages = entries
      .filter((e) => e.isDirectory() && !EXCLUDED.has(e.name))
      .map((e) => {
        const pageDir = path.join(SITE_DIR, e.name);
        const componentsDir = path.join(pageDir, 'components');

        const files: string[] = [];

        // List page-level files
        for (const f of fs.readdirSync(pageDir)) {
          const stat = fs.statSync(path.join(pageDir, f));
          if (stat.isFile()) files.push(`${e.name}/${f}`);
        }

        // List component files
        if (fs.existsSync(componentsDir)) {
          for (const f of fs.readdirSync(componentsDir)) {
            files.push(`${e.name}/components/${f}`);
          }
        }

        return {
          name: e.name,
          route: `/converted-preview/${e.name}`,
          files,
        };
      });

    return NextResponse.json({ pages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
