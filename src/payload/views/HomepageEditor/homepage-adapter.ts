import type { SectionInstance } from '../PageEditor/types';

// v2 redesign: the homepage is no longer edited through the legacy
// section-block PageEditor. It moved to the converted-pages flow at
// src/app/(site)/home/ — marketing edits via Pages → slug=home, where the
// 4-tab editor reads HomepageContent (src/lib/homepage-content.ts) and
// hp2-* components render the result.
//
// These two functions exist only because PageEditor/index.tsx and
// page-editor-preview/page.tsx still import them. They are now no-ops:
//   - homepageDocToSections → returns []  (no legacy sections to migrate)
//   - sectionsToHomepagePatch → returns {} (nothing to patch)
//
// The Homepage Payload global owns the v2 group fields directly; saves
// from its native admin form persist normally without going through this
// adapter. Keeping the legacy adapter import path intact prevents a
// build break in the page editor preview tooling.

export function homepageDocToSections(_doc: Record<string, unknown>): SectionInstance[] {
  return [];
}

export function sectionsToHomepagePatch(
  _sections: SectionInstance[],
): Record<string, unknown> {
  return {};
}
