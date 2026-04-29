import type { Migration } from './types.ts';
import { tableExists } from './helpers.ts';

/**
 * Deletes any existing Facebook entries from the Footer global's brand socials.
 * Mirrors the corresponding Postgres migration so dev DBs stay aligned with prod.
 */
export const migration: Migration = {
  id: '20260429_0026_remove_facebook_socials',
  name: 'Remove Facebook entries from footer_brand_socials',
  async up(client) {
    if (!(await tableExists(client, 'footer_brand_socials'))) return;
    await client.execute({
      sql: `DELETE FROM "footer_brand_socials" WHERE "platform" = ?;`,
      args: ['facebook'],
    });
  },
};
