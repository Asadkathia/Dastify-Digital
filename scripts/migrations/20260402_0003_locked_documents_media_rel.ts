import type { Migration } from './types.ts';
import { addColumnIfMissing } from './helpers.ts';

export const migration: Migration = {
  id: '20260402_0003_locked_documents_media_rel',
  name: 'Add payload_locked_documents_rels.media_id relation column',
  async up(client) {
    await addColumnIfMissing(client, 'payload_locked_documents_rels', {
      name: 'media_id',
      type: 'integer',
    });
  },
};
