import { nanoid } from 'nanoid';
import type { SectionInstance, BlockInstance } from '../PageEditor/types';

// ─── Section key ordering ────────────────────────────────────────────────────
const SECTION_ORDER = [
  'nav',
  'hero',
  'brandAcronym',
  'about',
  'features',
  'caseStudies',
  'services',
  'mission',
  'insights',
  'faq',
  'cta',
  'footer',
] as const;

type SectionKey = (typeof SECTION_ORDER)[number];

const BLOCK_TYPE_MAP: Record<SectionKey, string> = {
  nav: 'hp-nav',
  hero: 'hp-hero',
  brandAcronym: 'hp-brand-acronym',
  about: 'hp-about',
  features: 'hp-features',
  caseStudies: 'hp-case-studies',
  services: 'hp-services',
  mission: 'hp-mission',
  insights: 'hp-insights',
  faq: 'hp-faq',
  cta: 'hp-cta',
  footer: 'hp-footer',
};

const SECTION_LABELS: Record<SectionKey, string> = {
  nav: 'Navigation',
  hero: 'Hero',
  brandAcronym: 'Brand Acronym',
  about: 'About',
  features: 'Feature Strip',
  caseStudies: 'Case Studies',
  services: 'Services',
  mission: 'Mission',
  insights: 'Insights',
  faq: 'FAQ',
  cta: 'CTA',
  footer: 'Footer',
};

// ─── doc → SectionInstance[] ─────────────────────────────────────────────────

/**
 * Convert a raw Payload homepage global document into editor SectionInstance[].
 * Each homepage section becomes one Section containing one Block.
 * The block data IS the raw section data — zero transformation needed.
 */
export function homepageDocToSections(doc: Record<string, unknown>): SectionInstance[] {
  return SECTION_ORDER.map((key) => {
    const rawData = (doc[key] ?? {}) as Record<string, unknown>;
    const blockType = BLOCK_TYPE_MAP[key];

    // For array-valued sections (marquee, paragraphs, titleLines, checks)
    // the adapter normalises any plain string[] into the {value: string}[]
    // shape that the ArrayFieldEditor expects.
    const data = normaliseArrayFields(key, rawData);

    const block: BlockInstance = {
      id: `hp-block-${key}`,
      blockType,
      data,
    };

    const section: SectionInstance = {
      id: `hp-section-${key}`,
      label: SECTION_LABELS[key],
      columns: [
        {
          id: `hp-col-${key}`,
          width: '1/1',
          blocks: [block],
        },
      ],
    };

    return section;
  });
}

// ─── SectionInstance[] → PATCH body ─────────────────────────────────────────

/**
 * Convert editor sections back into the flat homepage global PATCH body.
 */
export function sectionsToHomepagePatch(
  sections: SectionInstance[],
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  for (const section of sections) {
    for (const col of section.columns) {
      for (const block of col.blocks) {
        const key = getSectionKeyFromBlockType(block.blockType);
        if (!key) continue;
        patch[key] = denormaliseArrayFields(key, block.data as Record<string, unknown>);
      }
    }
  }

  return patch;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSectionKeyFromBlockType(blockType: string): SectionKey | null {
  const entry = Object.entries(BLOCK_TYPE_MAP).find(([, bt]) => bt === blockType);
  return entry ? (entry[0] as SectionKey) : null;
}

/**
 * Normalise plain string arrays into the {value: string}[] shape
 * so the ArrayFieldEditor can handle them uniformly.
 */
function normaliseArrayFields(
  key: SectionKey,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...data };

  // marquee: string[] → {value: string}[]
  if (key === 'hero' && Array.isArray(clone.marquee)) {
    clone.marquee = (clone.marquee as unknown[]).map((v) =>
      typeof v === 'string' ? { value: v } : v,
    );
  }

  // paragraphs: string[] → {value: string}[]
  if (key === 'about' && Array.isArray(clone.paragraphs)) {
    clone.paragraphs = (clone.paragraphs as unknown[]).map((v) =>
      typeof v === 'string' ? { value: v } : v,
    );
  }

  // titleLines: string[] → {value: string}[]
  if (key === 'services' && Array.isArray(clone.titleLines)) {
    clone.titleLines = (clone.titleLines as unknown[]).map((v) =>
      typeof v === 'string' ? { value: v } : v,
    );
  }

  // checks: string[] → {value: string}[]
  if (key === 'mission' && Array.isArray(clone.checks)) {
    clone.checks = (clone.checks as unknown[]).map((v) =>
      typeof v === 'string' ? { value: v } : v,
    );
  }

  return clone;
}

/**
 * Reverse the normalisation: {value: string}[] → string[]
 * for fields that Payload expects as plain string arrays.
 */
function denormaliseArrayFields(
  key: SectionKey,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...data };

  if (key === 'hero' && Array.isArray(clone.marquee)) {
    clone.marquee = (clone.marquee as unknown[]).map((v) =>
      v && typeof v === 'object' && 'value' in (v as object)
        ? (v as { value: string }).value
        : v,
    );
  }

  if (key === 'about' && Array.isArray(clone.paragraphs)) {
    clone.paragraphs = (clone.paragraphs as unknown[]).map((v) =>
      v && typeof v === 'object' && 'value' in (v as object)
        ? (v as { value: string }).value
        : v,
    );
  }

  if (key === 'services' && Array.isArray(clone.titleLines)) {
    clone.titleLines = (clone.titleLines as unknown[]).map((v) =>
      v && typeof v === 'object' && 'value' in (v as object)
        ? (v as { value: string }).value
        : v,
    );
  }

  if (key === 'mission' && Array.isArray(clone.checks)) {
    clone.checks = (clone.checks as unknown[]).map((v) =>
      v && typeof v === 'object' && 'value' in (v as object)
        ? (v as { value: string }).value
        : v,
    );
  }

  return clone;
}
