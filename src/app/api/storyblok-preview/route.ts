import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

function toSafeSlugPath(slug: string): string {
  if (!slug.trim()) {
    return '/';
  }

  const normalized = slug.startsWith('/') ? slug : `/${slug}`;
  return normalized.startsWith('//') ? '/' : normalized;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  if (!process.env.STORYBLOK_PREVIEW_SECRET || secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(toSafeSlugPath(slug));
}
