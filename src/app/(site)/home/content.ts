// Homepage converted-page content.
//
// This file plugs the existing Homepage shape + defaults into the converted-
// pages system (the same pattern that powers /about, /services-convert,
// /blog-1 etc.). By re-exporting the canonical HomepageContent type and
// homepageContent defaults from lib/homepage-content.ts we avoid duplicating
// the ~350 lines of default copy and keep one source of truth.
//
// The converted-pages runtime treats `PageContent` as the type and
// `defaultContent` as the initial data. User edits live in the Pages record's
// `convertedContent` JSON and are merged over these defaults.

import { homepageContent } from '@/lib/homepage-content';
import type { HomepageContent } from '@/lib/homepage-content';

export type PageContent = HomepageContent;

export const defaultContent: PageContent = homepageContent;
