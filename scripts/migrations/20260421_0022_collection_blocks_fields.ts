import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * Adds a `blocks` field to BlogPosts, Services, and Case Studies collections.
 *
 * When a record has `blocks[]` populated (via the content converters), the
 * detail page at /blog/[slug], /services/[slug], or /case-studies/[slug]
 * renders the blocks pixel-perfect via PageBlocksRenderer instead of the
 * default hardcoded layout.
 *
 * On SQLite, `blocksAsJSON: true` in payload.config.ts means blocks are stored
 * as a single JSON text column — no per-block tables needed. That makes this
 * migration a simple column-add.
 *
 * The Postgres side is complex (per-block tables for each block type × each
 * collection). Generate it via `npx payload migrate:create` before deploying
 * to Neon.
 */
export const migration: Migration = {
  id: '20260421_0022_collection_blocks_fields',
  name: 'Add blocks JSON field to blog-posts, services, case-studies',
  async up(client) {
    // ─── blog_posts ──────────────────────────────────────────────────────────
    if (await tableExists(client, 'blog_posts')) {
      await addColumnIfMissing(client, 'blog_posts', { name: 'blocks', type: 'text' });
    }
    if (await tableExists(client, '_blog_posts_v')) {
      await addColumnIfMissing(client, '_blog_posts_v', { name: 'version_blocks', type: 'text' });
    }

    // ─── services ───────────────────────────────────────────────────────────
    if (await tableExists(client, 'services')) {
      await addColumnIfMissing(client, 'services', { name: 'blocks', type: 'text' });
    }
    if (await tableExists(client, '_services_v')) {
      await addColumnIfMissing(client, '_services_v', { name: 'version_blocks', type: 'text' });
    }

    // ─── case_studies ───────────────────────────────────────────────────────
    if (await tableExists(client, 'case_studies')) {
      await addColumnIfMissing(client, 'case_studies', { name: 'blocks', type: 'text' });
    }
    if (await tableExists(client, '_case_studies_v')) {
      await addColumnIfMissing(client, '_case_studies_v', { name: 'version_blocks', type: 'text' });
    }
  },
};
