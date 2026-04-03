import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

const COLLECTION_TABLES = ['pages', 'services', 'case_studies', 'blog_posts'] as const;
const VERSION_TABLES = ['_pages_v', '_services_v', '_case_studies_v', '_blog_posts_v'] as const;

export const migration: Migration = {
  id: '20260403_0008_collection_seo_extra_columns',
  name: 'Add canonical/noindex/keywords SEO columns to core collections and version tables',
  async up(client) {
    for (const table of COLLECTION_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [
        { name: 'meta_canonical_url', type: 'text' },
        { name: 'meta_noindex', type: 'integer' },
        { name: 'meta_keywords', type: 'text' },
      ]);
    }

    for (const table of VERSION_TABLES) {
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
