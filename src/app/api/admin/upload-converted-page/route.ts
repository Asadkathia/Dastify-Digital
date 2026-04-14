import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import payloadConfig from '@payload-config';
import { getConvertedPageContentConfig, loadConvertedPageContent } from '@/lib/converted-pages/content-map';

const SITE_DIR = path.resolve(process.cwd(), 'src/app/(site)');

async function hasAdminSession(request: Request): Promise<boolean> {
  const auth = request.headers.get('authorization');
  const secret = process.env.PAYLOAD_SECRET;

  if (secret && auth === `Bearer ${secret}`) {
    return true;
  }

  const cookie = request.headers.get('cookie');
  if (!cookie) return false;

  try {
    const meRes = await fetch(new URL('/api/users/me', request.url), {
      headers: { cookie },
      cache: 'no-store',
    });

    if (!meRes.ok) return false;

    const me = (await meRes.json()) as { user?: { id?: string | number; role?: string }; id?: string | number; role?: string };
    const user = me.user ?? me;

    if (!user?.id) return false;
    if (!user.role) return true;
    return user.role === 'admin' || user.role === 'editor';
  } catch {
    return false;
  }
}

function toTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function extractRenderedContent(html: string): string | null {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch?.[1]) return mainMatch[1].trim();

  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch?.[1]) return bodyMatch[1].trim();

  return null;
}

function extractTagByRegex(html: string, tag: string, pattern: RegExp): string | null {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*${pattern.source}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'i'));
  return match?.[0]?.trim() || null;
}

function extractConvertedSectionHTML(pageName: string, key: string, html: string): string | null {
  if (key === 'nav') {
    return html.match(/<nav\b[^>]*id=["']nav["'][^>]*>[\s\S]*?<\/nav>/i)?.[0]?.trim() || null;
  }

  if (key === 'footer') {
    const aboutFooter = extractTagByRegex(html, 'footer', /class=["'][^"']*\babout-footer\b[^"']*["']/);
    if (aboutFooter) return aboutFooter;
    const servicesFooter = extractTagByRegex(html, 'footer', /class=["'][^"']*\bsvc-convert-footer\b[^"']*["']/);
    if (servicesFooter) return servicesFooter;
    return html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0]?.trim() || null;
  }

  const classCandidatesByPage: Record<string, Record<string, string[]>> = {
    about: {
      hero: ['about-hero'],
      manifesto: ['about-manifesto'],
      difference: ['about-difference'],
      story: ['about-story'],
      team: ['about-team'],
      values: ['about-values'],
      cta: ['about-cta-close', 'about-cta'],
    },
    'services-convert': {
      hero: ['svc-convert-hero'],
      services: ['svc-convert-services'],
      results: ['svc-convert-results'],
      why: ['svc-convert-why'],
      process: ['svc-convert-process'],
      cta: ['svc-convert-cta'],
    },
  };

  const candidates = classCandidatesByPage[pageName]?.[key] || [`${pageName}-${key}`];

  for (const candidate of candidates) {
    const section = extractTagByRegex(html, 'section', new RegExp(`class=["'][^"']*\\b${candidate}\\b[^"']*["']`));
    if (section) return section;
  }

  return null;
}

export async function POST(request: Request) {
  if (!(await hasAdminSession(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { pageName?: string };
    const pageName = body.pageName?.trim() || '';

    if (!pageName) {
      return NextResponse.json({ ok: false, error: 'Missing required field: pageName' }, { status: 400 });
    }

    const pageDir = path.join(SITE_DIR, pageName);
    const hasConvertedSource =
      fs.existsSync(pageDir) &&
      (
        fs.existsSync(path.join(pageDir, 'content.ts')) ||
        fs.existsSync(path.join(pageDir, 'editor-registry.ts')) ||
        fs.existsSync(path.join(pageDir, 'components'))
      );

    if (!hasConvertedSource) {
      return NextResponse.json(
        { ok: false, error: `Converted page "${pageName}" not found in src/app/(site).` },
        { status: 404 },
      );
    }

    const payload = await getPayload({ config: await payloadConfig });

    const existing = await payload.find({
      collection: 'pages',
      where: {
        or: [
          { convertedPageName: { equals: pageName } },
          { slug: { equals: pageName } },
        ],
      },
      limit: 1,
    });

    const existingDoc = existing.docs[0] as
      | { id?: string | number; blocks?: unknown; title?: string }
      | undefined;

    const title = toTitle(pageName) || pageName;
    let blocks: Record<string, unknown>[] = [];
    let convertedContent: Record<string, unknown> | null = null;

    const convertedConfig = getConvertedPageContentConfig(pageName);
    if (convertedConfig) {
      const loadedConvertedContent = await loadConvertedPageContent(pageName);
      if (!loadedConvertedContent) {
        return NextResponse.json(
          { ok: false, error: `Could not load converted content for "${pageName}".` },
          { status: 500 },
        );
      }

      // Converted pages should stay structured in CMS so the page visual editor
      // can render real converted sections instead of opaque HTML blobs.
      blocks = [];
      convertedContent = structuredClone(loadedConvertedContent);
    } else {
      const siteUrl = new URL(request.url).origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      let response: Response;
      try {
        response = await fetch(`${siteUrl.replace(/\/$/, '')}/converted-preview/${pageName}`, { cache: 'no-store' });
      } catch {
        return NextResponse.json(
            { ok: false, error: `Dev server must be running at ${siteUrl} to fetch converted preview HTML.` },
          { status: 503 },
        );
      }
      if (!response.ok) {
        return NextResponse.json(
            { ok: false, error: `Failed to fetch converted page HTML from ${siteUrl}/converted-preview/${pageName} (${response.status}).` },
          { status: 502 },
        );
      }

      const html = await response.text();
      // Fallback for non-registered converted pages: import a live iframe snapshot block.
      const mainHtml = extractRenderedContent(html);
      if (!mainHtml) {
        return NextResponse.json({ ok: false, error: 'Could not extract <main> or <body> content from rendered HTML.' }, { status: 422 });
      }
      blocks = [
        {
          blockType: 'custom-html-block',
          label: `${title} — Full Page`,
          html: mainHtml,
        },
      ];
    }

    let page: { id?: string | number };
    const existingId = String(existingDoc?.id ?? '');

    if (existingDoc && existingId) {
      // With blocksAsJSON, blocks live on the parent row, so a plain update
      // replaces the previous content in-place. No delete+recreate dance,
      // no block-table cleanup required.
      page = await payload.update({
        collection: 'pages',
        id: existingId,
        data: {
          title,
          convertedPageName: pageName,
          convertedContent: convertedContent as never,
          blocks: blocks as never,
        },
      }) as { id?: string | number };
    } else {
      page = await payload.create({
        collection: 'pages',
        data: {
          title,
          slug: pageName,
          convertedPageName: pageName,
          convertedContent: convertedContent as never,
          _status: 'draft',
          blocks: blocks as never,
        },
      }) as { id?: string | number };
    }

    const pageId = String((page as { id?: string | number }).id ?? '');
    return NextResponse.json({
      ok: true,
      repairedExisting: Boolean(existingId),
      pageId,
      slug: pageName,
      adminUrl: pageId ? `/admin/collections/pages/${pageId}` : null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
