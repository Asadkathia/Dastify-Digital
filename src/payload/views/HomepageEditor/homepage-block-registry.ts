import type { BlockDefinition } from '../PageEditor/types';

// v2 redesign: the legacy hp-* block definitions (hp-nav / hp-hero /
// hp-brand-acronym / hp-about / hp-features / hp-case-studies /
// hp-services / hp-mission / hp-insights / hp-faq / hp-cta / hp-footer)
// are no longer used. The homepage moved to the converted-pages flow at
// src/app/(site)/home/, with content driven by HomepageContent (see
// src/lib/homepage-content.ts) and rendered by hp2-* components.
//
// This module previously held ~511 lines of legacy block field schemas.
// Now stubbed to an empty record so the import path stays valid for
// PageEditor/block-registry.ts (which re-exports it for the block palette).

export const homepageBlockRegistry: Record<string, BlockDefinition> = {};

export function getHomepageBlockDefinition(blockType: string): BlockDefinition | null {
  return homepageBlockRegistry[blockType] ?? null;
}
