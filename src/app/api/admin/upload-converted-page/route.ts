import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import type { Payload } from 'payload';
import payloadConfig from '@payload-config';
import { getConvertedPageContentConfig, loadConvertedPageContent } from '@/lib/converted-pages/content-map';
import type { FormDefinition } from '@/lib/forms/types';
import { buildPayloadFormFields } from '@/lib/forms/build-fields';

const SITE_DIR = path.resolve(process.cwd(), 'src/app/(site)');

// ─── Form upsert ──────────────────────────────────────────────────────────────

/**
 * Create or update a Payload form for a converted page.
 * Returns the form ID, or null if no form definition is provided.
 */
async function upsertPayloadForm(
  payload: Payload,
  pageName: string,
  formDef: FormDefinition,
  existingFormId?: string | number | null,
): Promise<string | number | null> {
  const fields = buildPayloadFormFields(formDef.fields);

  if (existingFormId) {
    // Update existing form — preserves submissions history
    const updated = await payload.update({
      collection: 'forms',
      id: String(existingFormId),
      data: {
        title: formDef.title,
        fields: fields as never,
        submitButtonLabel: formDef.submitButtonLabel,
        confirmationType: 'message',
        confirmationMessage: formDef.confirmationMessage
          ? { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: formDef.confirmationMessage, version: 1 }], direction: null, format: '', indent: 0 }], direction: null, format: '', indent: 0, version: 1 } }
          : undefined,
      } as never,
    });
    return (updated as { id?: string | number }).id ?? existingFormId;
  }

  // Check if a form already exists for this page (by title convention)
  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: formDef.title } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    const existingId = (existing.docs[0] as { id?: string | number }).id;
    if (existingId) {
      await payload.update({
        collection: 'forms',
        id: String(existingId),
        data: {
          fields: fields as never,
          submitButtonLabel: formDef.submitButtonLabel,
        } as never,
      });
      return existingId;
    }
  }

  const created = await payload.create({
    collection: 'forms',
    data: {
      title: formDef.title,
      fields: fields as never,
      submitButtonLabel: formDef.submitButtonLabel ?? 'Submit',
      confirmationType: 'message',
      confirmationMessage: formDef.confirmationMessage
        ? { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: formDef.confirmationMessage, version: 1 }], direction: null, format: '', indent: 0 }], direction: null, format: '', indent: 0, version: 1 } }
        : { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: "Thank you! We'll be in touch within one business day.", version: 1 }], direction: null, format: '', indent: 0 }], direction: null, format: '', indent: 0, version: 1 } },
    } as never,
  });
  return (created as { id?: string | number }).id ?? null;
}

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

      // ── Auto-create Payload forms for any sections that define a form ──────
      // Load the editor registry dynamically to check for form definitions
      try {
        const registryMod = await import(`../../../../app/(site)/${pageName}/editor-registry`);
        const registry = registryMod.default as { formDefinitions?: Record<string, FormDefinition> } | null;
        if (registry?.formDefinitions) {
          for (const [sectionKey, formDef] of Object.entries(registry.formDefinitions)) {
            const section = convertedContent[sectionKey] as Record<string, unknown> | undefined;
            const existingFormId = section?.formId as string | number | null | undefined;
            const formId = await upsertPayloadForm(payload, pageName, formDef, existingFormId);
            if (formId != null) {
              if (!convertedContent[sectionKey] || typeof convertedContent[sectionKey] !== 'object') {
                convertedContent[sectionKey] = {};
              }
              (convertedContent[sectionKey] as Record<string, unknown>).formId = formId;
            }
          }
        }
      } catch {
        // Registry may not have formDefinitions — that's fine, skip silently
      }
    } else {
      const siteUrl = new URL(request.url).origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const base = siteUrl.replace(/\/$/, '');

      // Try the dedicated preview route first, then fall back to the direct page URL.
      const urlsToTry = [
        `${base}/converted-preview/${pageName}`,
        `${base}/${pageName}`,
      ];

      let response: Response | null = null;
      let fetchError = '';
      for (const url of urlsToTry) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (res.ok) { response = res; break; }
          fetchError = `${url} → ${res.status}`;
        } catch (e) {
          fetchError = `${url} → ${e instanceof Error ? e.message : 'fetch error'}`;
        }
      }

      if (!response) {
        return NextResponse.json(
          { ok: false, error: `Could not fetch page HTML. Tried: ${urlsToTry.join(', ')}. Last error: ${fetchError}. Make sure the dev server is running.` },
          { status: 503 },
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

    // Only set convertedPageName for pages that have a registered registry+content
    // (about, services-convert, etc.). For standalone converter-generated pages,
    // we store them as regular block pages so the editor doesn't try to use an
    // unregistered converted-page renderer.
    const isRegisteredConverted = Boolean(convertedConfig);

    if (existingDoc && existingId) {
      page = await payload.update({
        collection: 'pages',
        id: existingId,
        data: {
          title,
          ...(isRegisteredConverted
            ? { convertedPageName: pageName, convertedContent: convertedContent as never }
            : { convertedPageName: null as never, convertedContent: null as never }),
          blocks: blocks as never,
        },
      }) as { id?: string | number };
    } else {
      page = await payload.create({
        collection: 'pages',
        data: {
          title,
          slug: pageName,
          ...(isRegisteredConverted
            ? { convertedPageName: pageName, convertedContent: convertedContent as never }
            : {}),
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
