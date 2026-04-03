import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists, columnExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260403_0006_homepage_seo_columns',
  name: 'Add homepage SEO columns introduced by seo plugin',
  async up(client) {
    if (!(await tableExists(client, 'homepage'))) {
      return;
    }

    await addColumnsIfMissing(client, 'homepage', [
      { name: 'meta_title', type: 'text' },
      { name: 'meta_description', type: 'text' },
      { name: 'meta_image_id', type: 'integer' },
    ]);

    const hasMetaImageIndex = await columnExists(client, 'homepage', 'meta_image_id');
    if (hasMetaImageIndex) {
      await client.execute(
        'CREATE INDEX IF NOT EXISTS "homepage_meta_meta_image_idx" ON "homepage" ("meta_image_id");',
      );
    }
  },
};
