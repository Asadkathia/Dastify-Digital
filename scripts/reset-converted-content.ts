import { getPayload } from 'payload';
import payloadConfig from '@payload-config';

/**
 * Wipe convertedContent JSON for one or more converted pages.
 *
 * Use after a PageContent shape change: when the new type differs from the
 * data already stored in convertedContent, the merge leaves new fields
 * undefined and the page crashes (e.g. renderEmHtml on an undefined string).
 * Resetting forces the public render to fall back to defaultContent in the
 * page's content.ts, which is what we want after a redesign rebuild.
 *
 * Usage:
 *   node --import tsx scripts/reset-converted-content.ts about
 *   node --import tsx scripts/reset-converted-content.ts about services contact
 *   node --import tsx scripts/reset-converted-content.ts --all
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: reset-converted-content <pageName...>  |  --all');
    process.exitCode = 1;
    return;
  }

  const payload = await getPayload({ config: await payloadConfig });

  const where = args.includes('--all')
    ? { convertedPageName: { exists: true } }
    : { convertedPageName: { in: args } };

  const found = await payload.find({
    collection: 'pages',
    where: where as never,
    limit: 200,
    depth: 0,
  });

  if (found.docs.length === 0) {
    console.log('[reset-converted] No matching pages.');
    return;
  }

  let updated = 0;
  for (const doc of found.docs as Array<{ id: string | number; convertedPageName?: string; slug?: string }>) {
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { convertedContent: {} } as never,
    });
    console.log(`[reset-converted] cleared convertedContent — ${doc.convertedPageName ?? '?'} (slug=${doc.slug ?? '?'}, id=${doc.id})`);
    updated += 1;
  }

  console.log(`[reset-converted] Done. ${updated} page(s) reset.`);
}

main().catch((err) => {
  console.error('[reset-converted] failed:', err);
  process.exitCode = 1;
});
