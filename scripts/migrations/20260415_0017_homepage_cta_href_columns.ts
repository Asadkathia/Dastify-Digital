import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

const CTA_PREFIXES = [
  'nav_cta_href',
  'hero_primary_cta_href',
  'hero_secondary_cta_href',
  'about_cta_href',
  'case_studies_cta_href',
  'mission_cta_href',
  'insights_cta_href',
  'faq_cta_href',
];

function columnsFor(prefix: string): { name: string; type: string }[] {
  return [
    { name: `${prefix}_url`, type: 'text' },
    { name: `${prefix}_type`, type: 'text' },
    { name: `${prefix}_open_in_new_tab`, type: 'integer' },
  ];
}

export const migration: Migration = {
  id: '20260415_0017_homepage_cta_href_columns',
  name: 'Add structured CTA link (ctaHref) columns to homepage and version tables',
  async up(client) {
    if (await tableExists(client, 'homepage')) {
      for (const prefix of CTA_PREFIXES) {
        await addColumnsIfMissing(client, 'homepage', columnsFor(prefix));
      }
    }

    if (await tableExists(client, '_homepage_v')) {
      for (const prefix of CTA_PREFIXES) {
        await addColumnsIfMissing(
          client,
          '_homepage_v',
          columnsFor(`version_${prefix}`),
        );
      }
    }
  },
};
