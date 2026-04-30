import { NextResponse } from 'next/server';
import type { AIProvider } from '@/lib/import-agent/types';
import { resolveModel } from '@/lib/ai/default-models';
import { extractBlogPostFromHtml } from '@/lib/content-converters/blog-post/extractor';
import type { BlogPostCommitInput } from '@/lib/content-converters/blog-post/schema';
import { getPayloadClient } from '@/lib/payload';
import { hasAdminSession } from '@/lib/auth/has-admin-session';
import { normalizeSlug } from '@/lib/cms/slug';

/**
 * Two actions on one route:
 *   action=extract   → run AI on HTML, return BlogPostPreview
 *   action=commit    → create Blog Post draft in the CMS
 *
 * Kept as a single endpoint so the UI state machine (form → preview → commit)
 * doesn't need three different URLs. Body shape tells the server what to do.
 */

type ExtractRequest = {
  action: 'extract';
  html?: string;
  url?: string;
  provider: AIProvider;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
};

type CommitRequest = {
  action: 'commit';
} & BlogPostCommitInput;

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

  if (body.action === 'extract') {
    return handleExtract(body);
  }
  if (body.action === 'commit') {
    return handleCommit(body);
  }
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
        return NextResponse.json(
          { ok: false, error: `Failed to fetch URL (${res.status})` },
          { status: 400 },
        );
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

  const result = await extractBlogPostFromHtml({
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

    // Create any "new" categories the user opted into.
    const categoriesToCreate = Array.isArray(body.categoriesToCreate) ? body.categoriesToCreate : [];
    const createdCategoryIds: number[] = [];
    for (const name of categoriesToCreate) {
      if (!name || typeof name !== 'string') continue;
      const slug = normalizeSlug(name);
      if (!slug) continue;
      const existing = await payload.find({
        collection: 'blog-categories',
        where: { slug: { equals: slug } } as never,
        limit: 1,
      });
      const firstExisting = existing.docs?.[0] as unknown as { id: number } | undefined;
      if (firstExisting?.id !== undefined) {
        createdCategoryIds.push(firstExisting.id);
        continue;
      }
      const newCat = await payload.create({
        collection: 'blog-categories',
        data: { title: name.trim(), slug, _status: 'published' } as never,
      });
      const createdId = typeof newCat.id === 'number' ? newCat.id : Number(newCat.id);
      createdCategoryIds.push(createdId);
    }

    // Same for tags.
    const tagsToCreate = Array.isArray(body.tagsToCreate) ? body.tagsToCreate : [];
    const createdTagIds: number[] = [];
    for (const name of tagsToCreate) {
      if (!name || typeof name !== 'string') continue;
      const slug = normalizeSlug(name);
      if (!slug) continue;
      const existing = await payload.find({
        collection: 'tags',
        where: { slug: { equals: slug } } as never,
        limit: 1,
      });
      const firstExisting = existing.docs?.[0] as unknown as { id: number } | undefined;
      if (firstExisting?.id !== undefined) {
        createdTagIds.push(firstExisting.id);
        continue;
      }
      const newTag = await payload.create({
        collection: 'tags',
        data: { title: name.trim(), slug, _status: 'published' } as never,
      });
      const createdId = typeof newTag.id === 'number' ? newTag.id : Number(newTag.id);
      createdTagIds.push(createdId);
    }

    const categoryIds = dedupe([...(body.categoryIds ?? []), ...createdCategoryIds]);
    const tagIds = dedupe([...(body.tagIds ?? []), ...createdTagIds]);

    // Check for slug collision — if a draft with this slug already exists, fail loudly.
    const normalizedSlug = normalizeSlug(body.slug);
    const existingPost = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: normalizedSlug } } as never,
      limit: 1,
    });
    const collider = existingPost.docs?.[0] as unknown as { id: number } | undefined;
    if (collider?.id !== undefined) {
      return NextResponse.json(
        {
          ok: false,
          error: `A blog post with slug "${normalizedSlug}" already exists.`,
          existingId: collider.id,
        },
        { status: 409 },
      );
    }

    const pageBlocks = Array.isArray(body.blocks) && body.blocks.length > 0 ? body.blocks : null;

    const created = await payload.create({
      collection: 'blog-posts',
      draft: true,
      data: {
        title: body.title.trim(),
        slug: normalizedSlug,
        excerpt: body.excerpt?.trim() || null,
        publishedAt: body.publishedAt || null,
        featuredImage: body.featuredImageId ?? null,
        categories: categoryIds.length > 0 ? categoryIds : null,
        tags: tagIds.length > 0 ? tagIds : null,
        content: body.bodyLexical ?? null,
        blocks: pageBlocks,
        _status: 'draft',
      } as never,
    });

    const createdId = typeof created.id === 'number' ? created.id : Number(created.id);
    return NextResponse.json({
      ok: true,
      id: createdId,
      adminUrl: `/admin/collections/blog-posts/${createdId}`,
    });
  } catch (err) {
    console.error('[convert-blog-post commit] failed:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Commit failed.' },
      { status: 500 },
    );
  }
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
