import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE SEQUENCE IF NOT EXISTS navigation_id_seq;
    ALTER TABLE navigation ALTER COLUMN id SET DEFAULT nextval('navigation_id_seq');
    ALTER SEQUENCE navigation_id_seq OWNED BY navigation.id;

    CREATE SEQUENCE IF NOT EXISTS footer_id_seq;
    ALTER TABLE footer ALTER COLUMN id SET DEFAULT nextval('footer_id_seq');
    ALTER SEQUENCE footer_id_seq OWNED BY footer.id;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE navigation ALTER COLUMN id DROP DEFAULT;
    DROP SEQUENCE IF EXISTS navigation_id_seq;

    ALTER TABLE footer ALTER COLUMN id DROP DEFAULT;
    DROP SEQUENCE IF EXISTS footer_id_seq;
  `);
}
