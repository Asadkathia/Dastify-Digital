import type { Client } from '@libsql/client';

export type MigrationContext = {
  dbUri: string;
};

export type Migration = {
  id: string;
  name: string;
  up: (client: Client, context: MigrationContext) => Promise<void>;
};
