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
