import * as migration_20260402_132757_neon_init from './20260402_132757_neon_init';
import * as migration_20260403_145500_admin_schema_hotfix from './20260403_145500_admin_schema_hotfix';
import * as migration_20260411_001500_pages_block_schema_sync from './20260411_001500_pages_block_schema_sync';
import * as migration_20260411_003000_pages_converted_fields_sync from './20260411_003000_pages_converted_fields_sync';
import * as migration_20260414_navigation_global from './20260414_navigation_global';
import * as migration_20260416_141218 from './20260416_141218';
import * as migration_20260416_footer_global from './20260416_footer_global';
import * as migration_20260417_logo_image_globals from './20260417_logo_image_globals';

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
  {
    up: migration_20260411_001500_pages_block_schema_sync.up,
    down: migration_20260411_001500_pages_block_schema_sync.down,
    name: '20260411_001500_pages_block_schema_sync',
  },
  {
    up: migration_20260411_003000_pages_converted_fields_sync.up,
    down: migration_20260411_003000_pages_converted_fields_sync.down,
    name: '20260411_003000_pages_converted_fields_sync',
  },
  {
    up: migration_20260414_navigation_global.up,
    down: migration_20260414_navigation_global.down,
    name: '20260414_navigation_global',
  },
  {
    up: migration_20260416_141218.up,
    down: migration_20260416_141218.down,
    name: '20260416_141218',
  },
  {
    up: migration_20260416_footer_global.up,
    down: migration_20260416_footer_global.down,
    name: '20260416_footer_global',
  },
  {
    up: migration_20260417_logo_image_globals.up,
    down: migration_20260417_logo_image_globals.down,
    name: '20260417_logo_image_globals',
  },
];
