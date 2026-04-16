/**
 * Seeds the footer global with default data to local SQLite (or Neon if DATABASE_URI is set).
 * Usage: node --import tsx ./scripts/seed-footer.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { footerDefaults } from '../src/payload/seed/footer-defaults.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;

if (!/^file:/i.test(dbUri)) {
  console.error('[seed-footer] This script only seeds local SQLite. Use DATABASE_URI=file:... or omit.');
  process.exit(1);
}

const client = createClient({ url: dbUri });

function uuid(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

async function main() {
  const { brand, columns, copyright, badges } = footerDefaults;
  const now = new Date().toISOString();

  // Upsert root footer row (id=1)
  await client.execute(`
    INSERT INTO "footer" (id, brand_name_prefix, brand_accent, brand_name_suffix, brand_tagline, copyright, updated_at, created_at)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      brand_name_prefix = excluded.brand_name_prefix,
      brand_accent = excluded.brand_accent,
      brand_name_suffix = excluded.brand_name_suffix,
      brand_tagline = excluded.brand_tagline,
      copyright = excluded.copyright,
      updated_at = excluded.updated_at
  `, [brand.namePrefix, brand.accent, brand.nameSuffix, brand.tagline, copyright, now, now]);

  // Clear and re-seed socials
  await client.execute(`DELETE FROM footer_brand_socials WHERE _parent_id = 1`);
  for (let i = 0; i < brand.socials.length; i++) {
    const s = brand.socials[i];
    await client.execute(`
      INSERT INTO footer_brand_socials (_order, _parent_id, id, platform, href)
      VALUES (?, 1, ?, ?, ?)
    `, [i + 1, uuid(), s.platform, s.href]);
  }

  // Clear and re-seed columns + links
  const existingCols = await client.execute(`SELECT id FROM footer_columns WHERE _parent_id = 1`);
  for (const row of existingCols.rows) {
    await client.execute(`DELETE FROM footer_columns_links WHERE _parent_id = ?`, [String(row.id)]);
  }
  await client.execute(`DELETE FROM footer_columns WHERE _parent_id = 1`);

  for (let ci = 0; ci < columns.length; ci++) {
    const col = columns[ci];
    const colId = uuid();
    await client.execute(`
      INSERT INTO footer_columns (_order, _parent_id, id, title)
      VALUES (?, 1, ?, ?)
    `, [ci + 1, colId, col.title]);

    for (let li = 0; li < col.links.length; li++) {
      const link = col.links[li];
      await client.execute(`
        INSERT INTO footer_columns_links (_order, _parent_id, id, label, href, highlight)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [li + 1, colId, uuid(), link.label, link.href, link.highlight ? 1 : 0]);
    }
  }

  // Clear and re-seed badges
  await client.execute(`DELETE FROM footer_badges WHERE _parent_id = 1`);
  for (let i = 0; i < badges.length; i++) {
    const badge = badges[i];
    await client.execute(`
      INSERT INTO footer_badges (_order, _parent_id, id, label, tone)
      VALUES (?, 1, ?, ?, ?)
    `, [i + 1, uuid(), badge.label, badge.tone ?? null]);
  }

  const row = await client.execute(`SELECT COUNT(*) AS c FROM footer`);
  console.log(`[seed-footer] done. rows=${row.rows?.[0]?.c} db=${dbUri}`);
}

main().catch((err) => {
  console.error('[seed-footer] failed', err);
  process.exit(1);
});
