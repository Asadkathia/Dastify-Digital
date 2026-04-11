import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.pages') IS NOT NULL THEN
        ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "converted_page_name" varchar;
        ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "converted_content" jsonb;
      END IF;

      IF to_regclass('public._pages_v') IS NOT NULL THEN
        ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_converted_page_name" varchar;
        ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_converted_content" jsonb;
      END IF;
    END
    $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public._pages_v') IS NOT NULL THEN
        ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_converted_content";
        ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_converted_page_name";
      END IF;

      IF to_regclass('public.pages') IS NOT NULL THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "converted_content";
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "converted_page_name";
      END IF;
    END
    $$;
  `);
}
