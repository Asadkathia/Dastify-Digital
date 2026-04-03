import * as migration_20260402_132757_neon_init from './20260402_132757_neon_init';
import * as migration_20260403_145500_admin_schema_hotfix from './20260403_145500_admin_schema_hotfix';

export const migrations = [
  {
    up: migration_20260402_132757_neon_init.up,
    down: migration_20260402_132757_neon_init.down,
    name: '20260402_132757_neon_init',
  },
  {
    up: migration_20260403_145500_admin_schema_hotfix.up,
    down: migration_20260403_145500_admin_schema_hotfix.down,
    name: '20260403_145500_admin_schema_hotfix',
  },
];
