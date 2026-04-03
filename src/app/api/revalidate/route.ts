import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const headerSecret = request.headers.get('x-revalidate-secret');

  if (!secret || headerSecret !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    paths?: string[];
    tags?: string[];
  };

  for (const path of payload.paths || []) {
    if (typeof path === 'string' && path.startsWith('/')) {
      revalidatePath(path);
    }
  }

  for (const tag of payload.tags || []) {
    if (typeof tag === 'string' && tag.length > 0) {
      revalidateTag(tag, 'max');
    }
  }

  return NextResponse.json({ ok: true, paths: payload.paths || [], tags: payload.tags || [] });
}
