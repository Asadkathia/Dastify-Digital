import type { Migration } from './types.ts';
import { addColumnsIfMissing, columnExists, tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260403_0007_homepage_version_seo_columns',
  name: 'Add homepage version SEO columns introduced by seo plugin',
  async up(client) {
    if (!(await tableExists(client, '_homepage_v'))) {
      return;
    }

    await addColumnsIfMissing(client, '_homepage_v', [
      { name: 'version_meta_title', type: 'text' },
      { name: 'version_meta_description', type: 'text' },
      { name: 'version_meta_image_id', type: 'integer' },
    ]);

    const hasMetaImageColumn = await columnExists(client, '_homepage_v', 'version_meta_image_id');
    if (hasMetaImageColumn) {
      await client.execute(
        'CREATE INDEX IF NOT EXISTS "_homepage_v_version_meta_meta_image_idx" ON "_homepage_v" ("version_meta_image_id");',
      );
    }
  },
};
