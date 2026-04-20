import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type PayloadWebhookBody = {
  paths?: unknown;
  tags?: unknown;
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
  const providedSecret = request.headers.get('x-revalidate-secret');

  if (!secret || !providedSecret || providedSecret !== secret) {
    if (!secret) {
      console.error('[revalidate] REVALIDATE_SECRET is not configured; rejecting request.');
    }
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as PayloadWebhookBody;

  const payloadPaths = normalizePaths(payload.paths);
  const payloadTags = normalizeTags(payload.tags);

  const source: 'payload' | 'unknown' = payloadPaths.length > 0 || payloadTags.length > 0 ? 'payload' : 'unknown';
  const ignoredReason = source === 'unknown' ? 'Unsupported payload shape' : undefined;
  const paths = payloadPaths;
  const tags = payloadTags;

  for (const path of paths) {
    revalidatePath(path);
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ ok: true, source, paths, tags, ignoredReason });
}
