import { NextResponse } from 'next/server';
import type { AIProvider } from '@/lib/import-agent/types';
import { resolveModel } from '@/lib/ai/default-models';
import { extractCaseStudyFromHtml } from '@/lib/content-converters/case-study/extractor';
import type { CaseStudyCommitInput } from '@/lib/content-converters/case-study/schema';
import { getPayloadClient } from '@/lib/payload';
import { hasAdminSession } from '@/lib/auth/has-admin-session';
import { normalizeSlug } from '@/lib/cms/slug';

type ExtractRequest = {
  action: 'extract';
  html?: string;
  url?: string;
  provider: AIProvider;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
};

type CommitRequest = { action: 'commit' } & CaseStudyCommitInput;

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  if (!(await hasAdminSession(request, payload))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: ExtractRequest | CommitRequest;
  try {
    body = (await request.json()) as ExtractRequest | CommitRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.action === 'extract') return handleExtract(body);
  if (body.action === 'commit') return handleCommit(body);
  return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 });
}

async function handleExtract(body: ExtractRequest) {
  if (!body.provider) {
    return NextResponse.json({ ok: false, error: 'Missing AI provider' }, { status: 400 });
  }

  let html = typeof body.html === 'string' ? body.html : '';
  if (!html && body.url) {
    try {
      const res = await fetch(body.url, {
        headers: { 'user-agent': 'Mozilla/5.0 DastifyContentImporter/1.0' },
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: `Failed to fetch URL (${res.status})` }, { status: 400 });
      }
      html = await res.text();
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: err instanceof Error ? err.message : 'Could not fetch URL' },
        { status: 400 },
      );
    }
  }
  if (!html) {
    return NextResponse.json({ ok: false, error: 'HTML or URL is required' }, { status: 400 });
  }

  const model = resolveModel(body.provider, body.model);
  const result = await extractCaseStudyFromHtml({
    html,
    sourceUrl: body.url,
    aiConfig: {
      provider: body.provider,
      model,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
    },
    model,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, raw: result.raw }, { status: 500 });
  }
  return NextResponse.json(result);
}

async function handleCommit(body: CommitRequest) {
  if (!body.title || !body.slug) {
    return NextResponse.json({ ok: false, error: 'title and slug are required' }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const normalizedSlug = normalizeSlug(body.slug);

    const existingDoc = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: normalizedSlug } } as never,
      limit: 1,
    });
    const collider = existingDoc.docs?.[0] as unknown as { id: number } | undefined;
    if (collider?.id !== undefined) {
      return NextResponse.json(
        { ok: false, error: `A case study with slug "${normalizedSlug}" already exists.`, existingId: collider.id },
        { status: 409 },
      );
    }

    const rawStats = Array.isArray(body.stats) ? body.stats : [];
    const stats = rawStats
      .filter((s) => s && typeof s.value === 'string' && typeof s.label === 'string')
      .slice(0, 5);

    const pageBlocks = Array.isArray(body.blocks) && body.blocks.length > 0 ? body.blocks : null;

    const created = await payload.create({
      collection: 'case-studies',
      draft: true,
      data: {
        title: body.title.trim(),
        slug: normalizedSlug,
        client: body.client?.trim() || null,
        excerpt: body.excerpt?.trim() || null,
        featured: body.featured ?? false,
        filterTag: body.filterTag?.trim() || null,
        featuredImage: body.featuredImageId ?? null,
        stats: stats.length > 0 ? stats : null,
        content: body.bodyLexical ?? null,
        blocks: pageBlocks,
        _status: 'draft',
      } as never,
    });

    const createdId = typeof created.id === 'number' ? created.id : Number(created.id);
    return NextResponse.json({
      ok: true,
      id: createdId,
      adminUrl: `/admin/collections/case-studies/${createdId}`,
    });
  } catch (err) {
    console.error('[convert-case-study commit] failed:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Commit failed.' },
      { status: 500 },
    );
  }
}
