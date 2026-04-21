/**
 * Canonical section types (Dastify brand book §05 — Page Sections).
 *
 * Three of the 11 canonical section types are collection-backed:
 *   - "blog-posts"   → Insights/Blog section (brand book §08)
 *   - "services"     → Services accordion (brand book §06)
 *   - "case-studies" → Case Studies featured+mini (brand book §05)
 *
 * "static" means the section uses hand-entered data from content.ts (which
 * per brand book Rule 01 is the correct default — preserves provided content).
 * "auto" means: convention-detect at render time from the section key name.
 *
 * Testimonials, FAQ, etc. are brand-book sections too but have their own
 * distinct layouts; they are NOT interchangeable with this card-shaped family.
 */
export type CollectionSectionType = 'blog-posts' | 'services' | 'case-studies';
export type SectionType = CollectionSectionType | 'static' | 'auto';

export const COLLECTION_SECTION_TYPES: CollectionSectionType[] = [
  'blog-posts',
  'services',
  'case-studies',
];

/**
 * Convention-based detection. Maps common section-key patterns to a collection
 * type. Used only when a section has sectionType === 'auto'. Explicit values
 * always win over convention.
 */
const CONVENTIONS: Array<{ pattern: RegExp; type: CollectionSectionType }> = [
  { pattern: /^(blog|insights|articles|posts|news)/i, type: 'blog-posts' },
  { pattern: /^(grid|latest|featured)$/i, type: 'blog-posts' }, // common ambiguous keys default to blog
  { pattern: /^(services|offerings|solutions)/i, type: 'services' },
  { pattern: /^(work|case.?stud|projects|portfolio)/i, type: 'case-studies' },
];

export function detectSectionType(sectionKey: string): CollectionSectionType | null {
  for (const { pattern, type } of CONVENTIONS) {
    if (pattern.test(sectionKey)) return type;
  }
  return null;
}

/**
 * Resolve a section's effective type. When sectionType is 'auto', runs
 * convention detection against the given section key and returns the result
 * (or 'static' when nothing matched).
 */
export function resolveSectionType(
  sectionType: SectionType | undefined,
  sectionKey: string,
): CollectionSectionType | 'static' {
  const explicit = sectionType ?? 'auto';
  if (explicit === 'auto') {
    return detectSectionType(sectionKey) ?? 'static';
  }
  return explicit;
}

/**
 * Renderer-allowed types. Each renderer declares which collection types it can
 * render with its card layout. Editor dropdown filters options using this list
 * so marketing can't retag a BlogGrid block as "testimonials" (which would
 * produce a broken layout).
 *
 * All three card-shaped collection types are interchangeable: title, excerpt,
 * image, and a category-ish label all map cleanly across blog / services /
 * case-studies.
 */
export const CARD_GRID_ALLOWED_TYPES: SectionType[] = [
  'auto',
  'blog-posts',
  'services',
  'case-studies',
  'static',
];

/**
 * Generic card shape produced by any collection-backed section's data mapper
 * (see section-cards.ts). Declared here — in the types-only module — so
 * renderers in client-reachable code can reference it via `import type`
 * without pulling the server-only fetcher into the browser bundle.
 */
export type SectionCard = {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
  imageAlt: string;
  linkLabel: string;
  /** True when the card came from the static content.ts array (editable via data-field). */
  editable: boolean;
  /** Index in the original static posts[] array (only meaningful when editable=true). */
  staticIndex: number;
};
