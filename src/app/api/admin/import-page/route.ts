import { NextResponse } from 'next/server';
import type { ImportRequest } from '@/lib/import-agent/types';
import { runImportAgent } from '@/lib/import-agent';
import { resolveModel } from '@/lib/ai/default-models';
import { isReservedPageSlug, normalizeSlug, reservedSlugsList, suggestImportSlug } from '@/lib/import-agent/reserved-slugs';

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
    // backward compatibility: missing role means admin in this codebase
    if (!user.role) return true;
    return user.role === 'admin' || user.role === 'editor';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ImportRequest;

    if (!body?.html || !body?.slug || !body?.title || !body?.ai?.provider) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedSlug = normalizeSlug(body.slug);
    if (!normalizedSlug) {
      return NextResponse.json({ ok: false, error: 'Slug cannot be empty' }, { status: 400 });
    }

    if (isReservedPageSlug(normalizedSlug)) {
      const suggestedSlug = suggestImportSlug(normalizedSlug);
      return NextResponse.json(
        {
          ok: false,
          error: `Slug "${normalizedSlug}" is reserved. Use another slug. Reserved: ${reservedSlugsList().join(', ')}`,
          suggestedSlug,
        },
        { status: 400 },
      );
    }

    const normalizedBody: ImportRequest = {
      ...body,
      slug: normalizedSlug,
      ai: {
        ...body.ai,
        model: resolveModel(body.ai.provider, body.ai.model),
      },
    };

    const result = await runImportAgent(normalizedBody);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Invalid request',
      },
      { status: 400 },
    );
  }
}
