import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient as createSqliteClient } from '@libsql/client';
import pg from 'pg';

type MenuItemSeed = {
  id: string;
  order: number;
  label: string;
  href: string;
};

type MenuSeed = {
  title: string;
  location: 'header' | 'footer';
  items: MenuItemSeed[];
};

const MENU_SEEDS: MenuSeed[] = [
  {
    title: 'Header Menu',
    location: 'header',
    items: [
      { id: 'seed-header-home', order: 1, label: 'Home', href: '/' },
      { id: 'seed-header-services', order: 2, label: 'Services', href: '/services' },
      { id: 'seed-header-case-studies', order: 3, label: 'Case Studies', href: '/case-studies' },
      { id: 'seed-header-blog', order: 4, label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Footer Menu',
    location: 'footer',
    items: [
      { id: 'seed-footer-contact', order: 1, label: 'Contact', href: '/contact' },
      { id: 'seed-footer-privacy', order: 2, label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
];

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;
const isSqlite = dbUri.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(dbUri);

type DbAdapter = {
  execute: (sql: string, args?: (string | number | null)[]) => Promise<void>;
  queryOne: (sql: string, args?: (string | number | null)[]) => Promise<Record<string, unknown> | null>;
  close: () => Promise<void>;
};

function toPostgresSql(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${String(index)}`;
  });
}

function isSqliteBusyError(error: unknown): boolean {
  return error instanceof Error && /SQLITE_BUSY/i.test(error.message);
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withSqliteBusyRetry<T>(operation: () => Promise<T>): Promise<T> {
  const maxAttempts = 6;
  let attempt = 0;

  while (true) {
    attempt += 1;
    try {
      return await operation();
    } catch (error) {
      if (!isSqliteBusyError(error) || attempt >= maxAttempts) {
        throw error;
      }
      await sleep(50 * attempt);
    }
  }
}

async function createAdapter(uri: string): Promise<DbAdapter> {
  if (isSqlite) {
    const client = createSqliteClient({
      url: uri,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    return {
      async execute(sql, args = []) {
        await withSqliteBusyRetry(async () => {
          await client.execute({ sql, args });
        });
      },
      async queryOne(sql, args = []) {
        const result = await withSqliteBusyRetry(async () => {
          return client.execute({ sql, args });
        });
        return (result.rows?.[0] as Record<string, unknown> | undefined) ?? null;
      },
      async close() {
        // no-op for libsql client
      },
    };
  }

  if (isPostgres) {
    const pool = new pg.Pool({
      connectionString: uri,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
    });

    return {
      async execute(sql, args = []) {
        await pool.query(toPostgresSql(sql), args);
      },
      async queryOne(sql, args = []) {
        const result = await pool.query(toPostgresSql(sql), args);
        return (result.rows?.[0] as Record<string, unknown> | undefined) ?? null;
      },
      async close() {
        await pool.end();
      },
    };
  }

  throw new Error(`[seed:cms-baseline] unsupported DATABASE_URI scheme: ${uri}`);
}

async function ensureSiteSettings(db: DbAdapter): Promise<void> {
  await db.execute(
    `INSERT INTO "site_settings" (
      "site_name",
      "site_description",
      "organization_name",
      "default_canonical_base",
      "robots_policy",
      "updated_at",
      "created_at"
    )
    SELECT ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM "site_settings" LIMIT 1);`,
    [
      'Dastify Digital',
      'Dastify Digital is a growth-focused digital agency for SEO, performance, and web visibility.',
      'Dastify Digital',
      'http://localhost:3000',
      'index-follow',
    ],
  );
}

async function ensureMenus(db: DbAdapter): Promise<void> {
  for (const menu of MENU_SEEDS) {
    await db.execute(
      `INSERT INTO "menus" ("title", "location", "updated_at", "created_at")
      SELECT ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (SELECT 1 FROM "menus" WHERE "location" = ? LIMIT 1);`,
      [menu.title, menu.location, menu.location],
    );

    const row = await db.queryOne(`SELECT "id" FROM "menus" WHERE "location" = ? LIMIT 1;`, [menu.location]);
    const parentId = row?.id;
    if (parentId === undefined || parentId === null) {
      throw new Error(`[seed:cms-baseline] failed to resolve menu id for location: ${menu.location}`);
    }

    for (const item of menu.items) {
      await db.execute(
        `INSERT INTO "menus_items" ("_order", "_parent_id", "id", "label", "href")
        SELECT ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM "menus_items" WHERE "_parent_id" = ? AND "id" = ? LIMIT 1
        );`,
        [item.order, Number(parentId), item.id, item.label, item.href, Number(parentId), item.id],
      );
    }
  }
}

async function main(): Promise<void> {
  const db = await createAdapter(dbUri);

  try {
    await ensureSiteSettings(db);
    await ensureMenus(db);
  } finally {
    await db.close();
  }

  console.log(`[seed:cms-baseline] complete. db=${dbUri}`);
}

main().catch((error) => {
  console.error('[seed:cms-baseline] failed', error);
  process.exit(1);
});
