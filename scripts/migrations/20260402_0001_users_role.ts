import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260402_0001_users_role',
  name: 'Add users.role column with default admin',
  async up(client) {
    if (!(await tableExists(client, 'users'))) {
      return;
    }

    await addColumnIfMissing(client, 'users', {
      name: 'role',
      type: "text NOT NULL DEFAULT 'admin'",
    });
  },
};
