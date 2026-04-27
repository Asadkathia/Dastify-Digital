import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ContactPayload = Record<string, unknown>;

const REQUIRED_FIELDS = ['fullName', 'email'] as const;

export async function POST(req: Request) {
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    const value = payload[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      return NextResponse.json({ error: 'missing_field', field }, { status: 400 });
    }
  }

  const email = String(payload.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  // TODO(integration): wire to email/CRM. For now, log + acknowledge.
  console.log('[contact] new submission', {
    fullName: payload.fullName,
    email: payload.email,
    practiceName: payload.practiceName ?? null,
    specialty: payload.specialty ?? null,
    budget: payload.budget ?? null,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
