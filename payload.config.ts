import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import { Users } from './src/payload/collections/Users.ts';
import { Media } from './src/payload/collections/Media.ts';
import { Homepage } from './src/payload/globals/Homepage.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const defaultDatabaseURI = `file:${path.resolve(dirname, 'payload.db')}`;
const databaseURI = process.env.DATABASE_URI || defaultDatabaseURI;
const isLocalSqlite = databaseURI.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(databaseURI);
const enableSchemaPush = process.env.PAYLOAD_SCHEMA_PUSH === 'true';

const db = isPostgres
  ? postgresAdapter({
    // Keep schema changes migration-driven to avoid runtime DDL conflicts.
    push: enableSchemaPush,
    pool: {
      connectionString: databaseURI,
    },
  })
  : sqliteAdapter({
    // Keep schema changes migration-driven to avoid runtime DDL conflicts.
    // Set PAYLOAD_SCHEMA_PUSH=true only for one-off local debugging.
    push: enableSchemaPush && isLocalSqlite,
    client: {
      // Use absolute local path to avoid CWD-dependent SQLite file mismatches.
      url: databaseURI,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  });

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-payload-secret-change-me',
  admin: {
    user: Users.slug,
    livePreview: {
      globals: ['homepage'],
      url:
        process.env.NEXT_PUBLIC_SITE_URL
        || process.env.SERVER_URL
        || 'http://localhost:3000',
    },
  },
  collections: [Users, Media],
  globals: [Homepage],
  plugins: [
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
    }),
  ],
  db,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
});
