import type { Migration } from './types.ts';
import { addColumnsIfMissing } from './helpers.ts';

export const migration: Migration = {
  id: '20260408_0014_locked_documents_import_reports_rel_column',
  name: 'Add payload_locked_documents_rels.import_reports_id relation column',
  async up(client) {
    await addColumnsIfMissing(client, 'payload_locked_documents_rels', [
      { name: 'import_reports_id', type: 'integer' },
    ]);
  },
};
