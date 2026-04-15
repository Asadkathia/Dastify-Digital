import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * The sqliteAdapter is configured with `blocksAsJSON: true`, which causes
 * Payload's Drizzle adapter to expect block-array fields (like `forms.fields`)
 * to be stored in a single JSON column on the parent table rather than in
 * per-block side tables (`forms_blocks_text`, etc.).
 *
 * The original `forms` schema was created before that setting was enabled,
 * so the `fields` column never existed. SELECTs against `forms.fields` now
 * fail with SQLITE_ERROR. This migration adds the column as TEXT (holds JSON).
 */
export const migration: Migration = {
  id: '20260415_0018_forms_fields_json_column',
  name: 'Add forms.fields JSON column for blocksAsJSON adapter',
  async up(client) {
    if (await tableExists(client, 'forms')) {
      await addColumnIfMissing(client, 'forms', { name: 'fields', type: 'text' });
    }
  },
};
