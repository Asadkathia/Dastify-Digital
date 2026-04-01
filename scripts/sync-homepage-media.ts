import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient, type Client } from '@libsql/client';
import { homepageContent, type HomepageContent } from '../src/lib/homepage-content.ts';

type MediaRef = {
  id: number;
  url: string;
  filename: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;

const client = createClient({
  url: process.env.DATABASE_URI || defaultDbUri,
});

const imagesDir = path.resolve(projectRoot, 'public/images');
const mediaDir = path.resolve(projectRoot, 'public/media');

function parseJSON<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function getCurrentContent(db: Client): Promise<HomepageContent> {
  const row = await db.execute('SELECT content FROM homepage ORDER BY id ASC LIMIT 1;');
  const raw = row.rows?.[0]?.content;
  return parseJSON<HomepageContent>(raw, homepageContent);
}

async function ensureMediaTable(db: Client): Promise<void> {
  await db.execute(`CREATE TABLE IF NOT EXISTS "media" (
    "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "alt" text NOT NULL,
    "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    "url" text,
    "thumbnail_u_r_l" text,
    "filename" text,
    "mime_type" text,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric
  );`);
}

async function ensureMediaRecord(
  db: Client,
  imagePath: string,
  alt: string,
): Promise<MediaRef | null> {
  if (!imagePath.startsWith('/images/')) {
    return null;
  }

  const base = path.basename(imagePath);
  const src = path.resolve(imagesDir, base);
  const dest = path.resolve(mediaDir, base);

  try {
    await fs.access(src);
  } catch {
    return null;
  }

  await fs.mkdir(mediaDir, { recursive: true });
  await fs.copyFile(src, dest);

  const existing = await db.execute({
    sql: 'SELECT id, url, filename FROM media WHERE filename = ? LIMIT 1;',
    args: [base],
  });
  if (existing.rows && existing.rows.length > 0) {
    const row = existing.rows[0];
    return {
      id: Number(row.id),
      url: String(row.url ?? `/media/${base}`),
      filename: String(row.filename ?? base),
    };
  }

  await db.execute({
    sql: `INSERT INTO media (alt, url, filename, mime_type, filesize, updated_at, created_at)
      VALUES (?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
    args: [alt || base, `/media/${base}`, base, 'image/webp', null],
  });

  const created = await db.execute({
    sql: 'SELECT id, url, filename FROM media WHERE filename = ? ORDER BY id DESC LIMIT 1;',
    args: [base],
  });
  const row = created.rows?.[0];
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    url: String(row.url ?? `/media/${base}`),
    filename: String(row.filename ?? base),
  };
}

async function syncContentImages(content: HomepageContent, db: Client): Promise<HomepageContent> {
  const heroMedia = await ensureMediaRecord(db, content.hero.image, content.hero.imageAlt);
  const aboutMedia = await ensureMediaRecord(db, content.about.image, content.about.imageAlt);
  const missionMedia = await ensureMediaRecord(db, content.mission.image, content.mission.imageAlt);
  const mainCaseMedia = await ensureMediaRecord(db, content.caseStudies.main.image, content.caseStudies.main.alt);

  const featureCards = await Promise.all(
    content.features.cards.map(async (card) => {
      const media = await ensureMediaRecord(db, card.image, card.alt);
      return { ...card, imageMedia: media ?? undefined };
    }),
  );

  const caseMinis = await Promise.all(
    content.caseStudies.minis.map(async (mini) => {
      const media = await ensureMediaRecord(db, mini.image, mini.alt);
      return { ...mini, imageMedia: media ?? undefined };
    }),
  );

  const serviceItems = await Promise.all(
    content.services.items.map(async (item) => {
      const media = await ensureMediaRecord(db, item.image, item.alt);
      return { ...item, imageMedia: media ?? undefined };
    }),
  );

  const insightItems = await Promise.all(
    content.insights.items.map(async (item) => {
      const media = await ensureMediaRecord(db, item.image, item.alt);
      return { ...item, imageMedia: media ?? undefined };
    }),
  );

  return {
    ...content,
    hero: { ...content.hero, imageMedia: heroMedia ?? undefined },
    about: { ...content.about, imageMedia: aboutMedia ?? undefined },
    mission: { ...content.mission, imageMedia: missionMedia ?? undefined },
    features: { ...content.features, cards: featureCards },
    caseStudies: {
      ...content.caseStudies,
      main: { ...content.caseStudies.main, imageMedia: mainCaseMedia ?? undefined },
      minis: caseMinis,
    },
    services: { ...content.services, items: serviceItems },
    insights: { ...content.insights, items: insightItems },
  } as HomepageContent;
}

async function writeContent(db: Client, content: HomepageContent): Promise<void> {
  const payload = JSON.stringify(content);
  await db.execute({
    sql: `UPDATE homepage
      SET content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM homepage ORDER BY id ASC LIMIT 1);`,
    args: [payload],
  });
}

async function main() {
  await ensureMediaTable(client);
  const content = await getCurrentContent(client);
  const nextContent = await syncContentImages(content, client);
  await writeContent(client, nextContent);

  const count = await client.execute('SELECT COUNT(*) AS count FROM media;');
  console.log(
    `[sync-homepage-media] complete. media_count=${String(count.rows?.[0]?.count ?? 0)} db=${
      process.env.DATABASE_URI || defaultDbUri
    }`,
  );
}

main().catch((error) => {
  console.error('[sync-homepage-media] failed', error);
  process.exit(1);
});
