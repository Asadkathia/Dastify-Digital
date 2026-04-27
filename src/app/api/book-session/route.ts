import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type BookingPayload = Record<string, unknown>;

const REQUIRED_FIELDS = ['fullName', 'email', 'date', 'time'] as const;

export async function POST(req: Request) {
  let payload: BookingPayload;
  try {
    payload = (await req.json()) as BookingPayload;
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

  // TODO(integration): wire to calendar (Cal.com / Google Calendar) + CRM.
  // For now, log + acknowledge so the form has a real success path.
  console.log('[book-session] new booking', {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone ?? null,
    practiceName: payload.practiceName ?? null,
    specialty: payload.specialty ?? null,
    date: payload.date,
    time: payload.time,
    notes: payload.notes ?? null,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
