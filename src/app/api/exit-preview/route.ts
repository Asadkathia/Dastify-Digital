import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const preferredRegion = 'sin1';

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '/';
  const redirectTo = isSafeRedirectPath(slug) ? slug : '/';

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
