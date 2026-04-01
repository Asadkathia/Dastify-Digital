import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { buildConfig } from 'payload';
import { Users } from './src/payload/collections/Users.ts';
import { Media } from './src/payload/collections/Media.ts';
import { Homepage } from './src/payload/globals/Homepage.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const defaultDatabaseURI = `file:${path.resolve(dirname, 'payload.db')}`;

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
  db: sqliteAdapter({
    // Keep local/dev schema in sync at server boot.
    push: process.env.NODE_ENV !== 'production',
    client: {
      // Use absolute local path to avoid CWD-dependent SQLite file mismatches.
      url: process.env.DATABASE_URI || defaultDatabaseURI,
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
});
