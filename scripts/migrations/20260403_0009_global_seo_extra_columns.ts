import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

const GLOBAL_TABLES = ['homepage', 'site_settings'] as const;
const GLOBAL_VERSION_TABLES = ['_homepage_v'] as const;

export const migration: Migration = {
  id: '20260403_0009_global_seo_extra_columns',
  name: 'Add canonical/noindex/keywords SEO columns to globals and homepage versions',
  async up(client) {
    for (const table of GLOBAL_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [
        { name: 'meta_canonical_url', type: 'text' },
        { name: 'meta_noindex', type: 'integer' },
        { name: 'meta_keywords', type: 'text' },
      ]);
    }

    for (const table of GLOBAL_VERSION_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [
        { name: 'version_meta_canonical_url', type: 'text' },
        { name: 'version_meta_noindex', type: 'integer' },
        { name: 'version_meta_keywords', type: 'text' },
      ]);
    }
  },
};
