import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug') || '/';

  const previewSecret = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';
  const hasValidSecret = Boolean(previewSecret && secret === previewSecret);

  // In local development, allow preview without a secret so Payload admin links
  // can still open draft mode even when PREVIEW_SECRET is not configured.
  if (!hasValidSecret && (isProduction || secret)) {
    return NextResponse.json({ message: 'Invalid preview secret' }, { status: 401 });
  }

  const redirectTo = isSafeRedirectPath(slug) ? slug : '/';
  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
