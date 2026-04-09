import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import {
  getConvertedPageContentConfig,
  loadConvertedPageContent,
} from '@/lib/converted-pages/content-map';

function findObjectBounds(source: string, marker: string): { start: number; end: number } | null {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return null;
  const objectStart = source.indexOf('{', markerIndex);
  if (objectStart === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  let quote: '"' | "'" | null = null;

  for (let i = objectStart; i < source.length; i += 1) {
    const ch = source[i]!;

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (quote && ch === quote) {
        inString = false;
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch as '"' | "'";
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start: objectStart, end: i + 1 };
      }
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page')?.trim() || '';
  if (!page) {
    return NextResponse.json({ error: 'Missing required query param: page' }, { status: 400 });
  }

  const config = getConvertedPageContentConfig(page);
  if (!config) {
    return NextResponse.json({ error: `Unsupported converted page: ${page}` }, { status: 404 });
  }

  const content = await loadConvertedPageContent(page);
  if (!content) {
    return NextResponse.json({ error: `Could not load content for page: ${page}` }, { status: 404 });
  }

  return NextResponse.json({
    page,
    sections: config.sections,
    content,
  });
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Writing converted content is disabled in production.' }, { status: 403 });
  }

  const body = (await req.json()) as { page?: string; content?: Record<string, unknown> };
  const page = body.page?.trim() || '';
  const content = body.content;

  if (!page || !content || typeof content !== 'object') {
    return NextResponse.json({ error: 'Body must include { page, content }' }, { status: 400 });
  }

  const config = getConvertedPageContentConfig(page);
  if (!config) {
    return NextResponse.json({ error: `Unsupported converted page: ${page}` }, { status: 404 });
  }

  const absPath = path.resolve(process.cwd(), config.contentFile);
  if (!fs.existsSync(absPath)) {
    return NextResponse.json({ error: `Content file not found: ${config.contentFile}` }, { status: 404 });
  }

  const original = fs.readFileSync(absPath, 'utf8');
  const marker = 'export const defaultContent';
  const bounds = findObjectBounds(original, marker);
  if (!bounds) {
    return NextResponse.json({ error: `Could not locate defaultContent object in ${config.contentFile}` }, { status: 500 });
  }

  const markerIndex = original.indexOf(marker);
  const lineStart = original.lastIndexOf('\n', markerIndex) + 1;
  const prefix = original.slice(lineStart, bounds.start);
  const nextObject = JSON.stringify(content, null, 2);
  const nextSource = `${original.slice(0, lineStart)}${prefix}${nextObject}${original.slice(bounds.end)}`;

  fs.writeFileSync(absPath, nextSource, 'utf8');

  return NextResponse.json({ ok: true, page, file: config.contentFile });
}
