import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "navigation"
      ADD COLUMN IF NOT EXISTS "logo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

    ALTER TABLE "footer"
      ADD COLUMN IF NOT EXISTS "brand_logo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "navigation" DROP COLUMN IF EXISTS "logo_image_id";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "brand_logo_image_id";
  `);
}
