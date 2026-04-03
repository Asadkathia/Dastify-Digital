import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

const COLLECTION_TABLES = ['pages', 'services', 'case_studies', 'blog_posts'] as const;
const VERSION_TABLES = ['_pages_v', '_services_v', '_case_studies_v', '_blog_posts_v'] as const;
const GLOBAL_TABLES = ['homepage', 'site_settings'] as const;
const GLOBAL_VERSION_TABLES = ['_homepage_v'] as const;

export const migration: Migration = {
  id: '20260403_0010_canonical_url_column_name_fix',
  name: 'Add canonicalURL columns using Payload expected snake case canonical_u_r_l',
  async up(client) {
    for (const table of COLLECTION_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [{ name: 'meta_canonical_u_r_l', type: 'text' }]);
    }

    for (const table of VERSION_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [{ name: 'version_meta_canonical_u_r_l', type: 'text' }]);
    }

    for (const table of GLOBAL_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [{ name: 'meta_canonical_u_r_l', type: 'text' }]);
    }

    for (const table of GLOBAL_VERSION_TABLES) {
      if (!(await tableExists(client, table))) {
        continue;
      }

      await addColumnsIfMissing(client, table, [{ name: 'version_meta_canonical_u_r_l', type: 'text' }]);
    }
  },
};
