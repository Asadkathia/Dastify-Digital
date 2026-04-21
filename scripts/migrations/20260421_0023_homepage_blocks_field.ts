import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * Adds a `blocks` field to the Homepage global, unifying its visual editor with
 * the Pages collection's page builder. When populated, the homepage renders via
 * PageBlocksRenderer using the same 42-block palette as Pages; otherwise the
 * legacy structured fields (nav/hero/services/etc.) keep rendering.
 *
 * SQLite: single JSON text column because payload.config.ts sets blocksAsJSON:true.
 * Postgres: ~150 per-block tables (generated separately via migrate:create).
 */
export const migration: Migration = {
  id: '20260421_0023_homepage_blocks_field',
  name: 'Add blocks JSON field to Homepage global',
  async up(client) {
    if (await tableExists(client, 'homepage')) {
      await addColumnIfMissing(client, 'homepage', { name: 'blocks', type: 'text' });
    }
    if (await tableExists(client, '_homepage_v')) {
      await addColumnIfMissing(client, '_homepage_v', { name: 'version_blocks', type: 'text' });
    }
  },
};
