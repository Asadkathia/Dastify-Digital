import type { Migration } from './types.ts';
import { migration as usersRole } from './20260402_0001_users_role.ts';
import { migration as homepageStructuredStorage } from './20260402_0002_homepage_structured_storage.ts';
import { migration as lockedDocumentsMediaRel } from './20260402_0003_locked_documents_media_rel.ts';
import { migration as lockedDocumentsNewRelColumns } from './20260403_0004_locked_documents_new_rel_columns.ts';
import { migration as lockedDocumentsFormBuilderRelColumns } from './20260403_0005_locked_documents_form_builder_rel_columns.ts';
import { migration as homepageSeoColumns } from './20260403_0006_homepage_seo_columns.ts';
import { migration as homepageVersionSeoColumns } from './20260403_0007_homepage_version_seo_columns.ts';
import { migration as collectionSeoExtraColumns } from './20260403_0008_collection_seo_extra_columns.ts';
import { migration as globalSeoExtraColumns } from './20260403_0009_global_seo_extra_columns.ts';
import { migration as canonicalUrlColumnNameFix } from './20260403_0010_canonical_url_column_name_fix.ts';
import { migration as sectionBlockTables } from './20260406_0011_section_block_tables.ts';
import { migration as newBlockTables } from './20260407_0012_new_block_tables.ts';
import { migration as newBlockTables2 } from './20260407_0013_new_block_tables_2.ts';
import { migration as lockedDocumentsImportReportsRelColumn } from './20260408_0014_locked_documents_import_reports_rel_column.ts';
import { migration as importReportsTable } from './20260408_0015_import_reports_table.ts';
import { migration as pagesConvertedContent } from './20260410_0016_pages_converted_content.ts';
import { migration as homepageCtaHrefColumns } from './20260415_0017_homepage_cta_href_columns.ts';
import { migration as formsFieldsJsonColumn } from './20260415_0018_forms_fields_json_column.ts';
import { migration as footerGlobal } from './20260416_0019_footer_global.ts';
import { migration as logoImageGlobals } from './20260417_0020_logo_image_globals.ts';
import { migration as canonicalSectionFields } from './20260420_0021_canonical_section_fields.ts';
import { migration as collectionBlocksFields } from './20260421_0022_collection_blocks_fields.ts';
import { migration as homepageBlocksField } from './20260421_0023_homepage_blocks_field.ts';
import { migration as sectionBlockSpacingFields } from './20260421_0024_section_block_spacing_fields.ts';
import { migration as sectionBlockBreakpointStyles } from './20260421_0025_section_block_breakpoint_styles.ts';

export const migrations: Migration[] = [
  usersRole,
  homepageStructuredStorage,
  lockedDocumentsMediaRel,
  lockedDocumentsNewRelColumns,
  lockedDocumentsFormBuilderRelColumns,
  homepageSeoColumns,
  homepageVersionSeoColumns,
  collectionSeoExtraColumns,
  globalSeoExtraColumns,
  canonicalUrlColumnNameFix,
  sectionBlockTables,
  newBlockTables,
  newBlockTables2,
  lockedDocumentsImportReportsRelColumn,
  importReportsTable,
  pagesConvertedContent,
  homepageCtaHrefColumns,
  formsFieldsJsonColumn,
  footerGlobal,
  logoImageGlobals,
  canonicalSectionFields,
  collectionBlocksFields,
  homepageBlocksField,
  sectionBlockSpacingFields,
  sectionBlockBreakpointStyles,
];
