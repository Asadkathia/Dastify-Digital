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
];
