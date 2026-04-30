import { NextResponse } from 'next/server';
import type { ImportRequest } from '@/lib/import-agent/types';
import { runImportAgent } from '@/lib/import-agent';
import { resolveModel } from '@/lib/ai/default-models';
import { isReservedPageSlug, normalizeSlug, reservedSlugsList, suggestImportSlug } from '@/lib/import-agent/reserved-slugs';
import { getPayloadClient } from '@/lib/payload';
import { hasAdminSession } from '@/lib/auth/has-admin-session';

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  if (!(await hasAdminSession(request, payload))) {
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
