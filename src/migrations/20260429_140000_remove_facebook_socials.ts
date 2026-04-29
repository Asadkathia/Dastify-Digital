import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Removes any existing Facebook entries from the Footer global's brand socials.
 * The 'facebook' enum value remains in `enum_footer_brand_socials_platform` to
 * keep this migration safe and reversible — only data rows are deleted.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "footer_brand_socials" WHERE "platform" = 'facebook';
  `)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // No-op: we don't restore deleted rows.
}
