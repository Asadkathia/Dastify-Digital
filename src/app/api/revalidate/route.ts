import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { storyblokSlugToPathname } from '@/lib/storyblok';

type PayloadWebhookBody = {
  paths?: unknown;
  tags?: unknown;
};

type StoryblokWebhookBody = {
  action?: unknown;
  story?: {
    full_slug?: unknown;
  };
};

function normalizePaths(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((path): path is string => typeof path === 'string' && path.startsWith('/'));
}

function normalizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0);
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const headerSecret = request.headers.get('x-revalidate-secret');
  const querySecret = request.nextUrl.searchParams.get('secret');
  const providedSecret = headerSecret || querySecret;

  if (!secret || providedSecret !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as PayloadWebhookBody & StoryblokWebhookBody;

  const payloadPaths = normalizePaths(payload.paths);
  const payloadTags = normalizeTags(payload.tags);

  let source: 'payload' | 'storyblok' | 'unknown' = 'unknown';
  let ignoredReason: string | undefined;
  let paths = payloadPaths;
  let tags = payloadTags;

  if (paths.length > 0 || tags.length > 0) {
    source = 'payload';
  } else if (typeof payload.story?.full_slug === 'string') {
    const action = typeof payload.action === 'string' ? payload.action : '';

    if (action !== 'published' && action !== 'unpublished') {
      source = 'storyblok';
      ignoredReason = `Unsupported Storyblok action: ${action || 'unknown'}`;
    } else {
      source = 'storyblok';
      const storyPath = storyblokSlugToPathname(payload.story.full_slug);
      paths = [storyPath];
      tags = ['storyblok-page'];
    }
  } else {
    ignoredReason = 'Unsupported payload shape';
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ ok: true, source, paths, tags, ignoredReason });
}
