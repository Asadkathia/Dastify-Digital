import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { getPayload } from 'payload';
import payloadConfig from '../payload.config.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const sourceDbPath = path.resolve(projectRoot, 'payload.db');
const mediaRoots = [path.resolve(projectRoot, 'public/media'), path.resolve(projectRoot, 'public/images')];
const targetDbUri = process.env.DATABASE_URI;

if (!targetDbUri || !/^postgres(ql)?:\/\//i.test(targetDbUri)) {
  console.error('[sync:media] DATABASE_URI must point to the target Postgres/Neon database.');
  process.exit(1);
}

function runSqliteJson(sql) {
  const result = spawnSync('sqlite3', ['-json', sourceDbPath, sql], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `sqlite3 failed with status ${result.status}`);
  }

  const output = result.stdout.trim();
  if (!output) return [];
  return JSON.parse(output);
}

async function resolveSourceFile(fileName) {
  for (const root of mediaRoots) {
    const candidate = path.join(root, fileName);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue looking through roots.
    }
  }

  throw new Error(`Source file not found for media filename: ${fileName}`);
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig });

  const localMedia = runSqliteJson(
    'select id, filename, alt from media where filename is not null order by id',
  );

  const remoteExisting = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 200,
    pagination: false,
    overrideAccess: true,
  });

  const remoteByFilename = new Map(
    remoteExisting.docs
      .filter((doc) => typeof doc.filename === 'string')
      .map((doc) => [doc.filename, doc]),
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const media of localMedia) {
    const sourceFile = await resolveSourceFile(media.filename);
    const existing = remoteByFilename.get(media.filename);

    if (existing) {
      const needsAltUpdate = existing.alt !== media.alt;
      if (!needsAltUpdate) {
        skipped += 1;
        continue;
      }

      await payload.update({
        collection: 'media',
        id: existing.id,
        data: { alt: media.alt },
        overrideAccess: true,
      });
      updated += 1;
      console.log(`[sync:media] updated alt for ${media.filename}`);
      continue;
    }

    await payload.create({
      collection: 'media',
      data: { alt: media.alt },
      filePath: sourceFile,
      overrideAccess: true,
      overwriteExistingFiles: true,
    });
    created += 1;
    console.log(`[sync:media] uploaded ${media.filename}`);
  }

  console.log(`[sync:media] complete created=${created} updated=${updated} skipped=${skipped}`);
}

main().catch((error) => {
  console.error('[sync:media] failed', error);
  process.exit(1);
});
