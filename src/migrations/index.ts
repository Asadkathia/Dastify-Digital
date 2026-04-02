import * as migration_20260402_132757_neon_init from './20260402_132757_neon_init';

export const migrations = [
  {
    up: migration_20260402_132757_neon_init.up,
    down: migration_20260402_132757_neon_init.down,
    name: '20260402_132757_neon_init'
  },
];
