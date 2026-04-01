import type { Migration } from './types.ts';
import { migration as usersRole } from './20260402_0001_users_role.ts';
import { migration as homepageStructuredStorage } from './20260402_0002_homepage_structured_storage.ts';
import { migration as lockedDocumentsMediaRel } from './20260402_0003_locked_documents_media_rel.ts';

export const migrations: Migration[] = [
  usersRole,
  homepageStructuredStorage,
  lockedDocumentsMediaRel,
];
