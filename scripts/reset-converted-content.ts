import { createClient as createSqliteClient } from '@libsql/client';

/**
 * Wipe converted_content for one or more converted pages — directly on the
 * database (SQLite locally, Postgres on prod). Bypasses Payload's bootstrap
 * because Payload's loadEnv shim is broken under our pinned Next.js build,
 * which prevents getPayload() from initializing.
 *
 * Use after a PageContent shape change: when the new type differs from the
 * data already stored, the merge leaves new fields undefined and the page
 * crashes (e.g. data.mission undefined → TypeError on render).
 *
 * Usage:
 *   npm run pages:reset -- about
 *   npm run pages:reset -- about services-convert blog-1
 *   npm run pages:reset -- --all
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: pages:reset <convertedPageName...>  |  --all');
    process.exitCode = 1;
    return;
  }

  const dbUri = process.env.DATABASE_URI;
  if (!dbUri) {
    console.error('[reset-converted] DATABASE_URI is not set.');
    process.exitCode = 1;
    return;
  }

  const isAll = args.includes('--all');
  const isSqlite = dbUri.startsWith('file:');
  const isPg = /^postgres(ql)?:\/\//i.test(dbUri);

  if (!isSqlite && !isPg) {
    console.error(`[reset-converted] Unsupported DATABASE_URI scheme: ${dbUri.split(':')[0]}`);
    process.exitCode = 1;
    return;
  }

  if (isSqlite) {
    const client = createSqliteClient({ url: dbUri });
    const where = isAll
      ? 'converted_page_name IS NOT NULL'
      : `converted_page_name IN (${args.map(() => '?').join(',')})`;

    const before = await client.execute({
      sql: `SELECT id, slug, converted_page_name FROM pages WHERE ${where}`,
      args: isAll ? [] : args,
    });

    if (before.rows.length === 0) {
      console.log('[reset-converted] No matching pages.');
      client.close();
      return;
    }

    await client.execute({
      sql: `UPDATE pages SET converted_content = NULL WHERE ${where}`,
      args: isAll ? [] : args,
    });

    for (const row of before.rows) {
      console.log(
        `[reset-converted] cleared — ${row.converted_page_name} (slug=${row.slug}, id=${row.id})`,
      );
    }
    console.log(`[reset-converted] Done. ${before.rows.length} page(s) reset.`);
    client.close();
    return;
  }

  // Postgres
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString: dbUri });
  const client = await pool.connect();
  try {
    const placeholders = args.map((_, i) => `$${i + 1}`).join(',');
    const where = isAll
      ? 'converted_page_name IS NOT NULL'
      : `converted_page_name IN (${placeholders})`;
    const before = await client.query(
      `SELECT id, slug, converted_page_name FROM pages WHERE ${where}`,
      isAll ? [] : args,
    );
    if (before.rowCount === 0) {
      console.log('[reset-converted] No matching pages.');
      return;
    }
    await client.query(
      `UPDATE pages SET converted_content = NULL::jsonb WHERE ${where}`,
      isAll ? [] : args,
    );
    for (const row of before.rows) {
      console.log(
        `[reset-converted] cleared — ${row.converted_page_name} (slug=${row.slug}, id=${row.id})`,
      );
    }
    console.log(`[reset-converted] Done. ${before.rowCount} page(s) reset.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[reset-converted] failed:', err);
  process.exitCode = 1;
});
