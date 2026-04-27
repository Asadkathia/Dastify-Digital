import { getPayload } from 'payload';
import payloadConfig from '@payload-config';

/**
 * One-off: ensure there's a Pages record acting as the `home` converted page.
 * After this runs, `/` on the public site switches from the legacy hand-coded
 * component tree into the converted-pages dispatcher (same path used by
 * /about, /services-convert, etc.) — unlocking the 4-tab visual editor and
 * per-section spacing overrides.
 *
 * Idempotent: re-runs safely. If a record with convertedPageName='home'
 * already exists, logs "already present" and exits without changes.
 *
 * Usage:  node --import tsx scripts/seed-home-converted-page.ts
 */
async function main(): Promise<void> {
  const payload = await getPayload({ config: await payloadConfig });

  const existing = await payload.find({
    collection: 'pages',
    where: { convertedPageName: { equals: 'home' } } as never,
    limit: 1,
  });

  if ((existing.docs?.length ?? 0) > 0) {
    const doc = existing.docs[0] as { id?: string | number; title?: string; slug?: string };
    console.log(
      `[seed-home] Already present — id=${doc.id ?? '?'} title=${doc.title ?? '?'} slug=${doc.slug ?? '?'}. No changes.`,
    );
    return;
  }

  const created = await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      // Empty convertedContent → public render uses defaultContent from
      // src/app/(site)/home/content.ts. Visually identical to today's /.
      convertedPageName: 'home' as never,
      convertedContent: {} as never,
      _status: 'published',
    } as never,
  });

  const id = (created as { id?: string | number }).id;
  console.log(`[seed-home] Created Pages record id=${id} — / now routes through the converted-pages dispatcher.`);
}

main()
  .catch((err: unknown) => {
    console.error('[seed-home] failed:', err);
    process.exit(1);
  })
  .finally(() => {
    // Payload keeps DB connections open; force exit so the script doesn't hang.
    process.exit(0);
  });
