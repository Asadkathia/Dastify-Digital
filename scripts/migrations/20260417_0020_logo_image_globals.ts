import type { Migration } from './types.ts';

export const migration: Migration = {
  id: '20260417_0020_logo_image_globals',
  name: 'Add logo_image_id to navigation and footer globals',
  async up(client) {
    const navCols = await client.execute(`PRAGMA table_info(navigation)`);
    const hasNavLogo = navCols.rows.some((r) => r[1] === 'logo_image_id');
    if (!hasNavLogo) {
      await client.execute(`ALTER TABLE "navigation" ADD COLUMN "logo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL`);
    }

    const footerCols = await client.execute(`PRAGMA table_info(footer)`);
    const hasFooterLogo = footerCols.rows.some((r) => r[1] === 'brand_logo_image_id');
    if (!hasFooterLogo) {
      await client.execute(`ALTER TABLE "footer" ADD COLUMN "brand_logo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL`);
    }
  },
};
