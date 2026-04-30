import { describe, it, expect } from 'vitest';
import {
  convertedPageContentToSections,
  sectionsToConvertedPageContent,
  extractSectionInstances,
  extractDeletedSections,
  SECTION_ORDER_KEY,
  SECTION_INSTANCES_KEY,
  DELETED_SECTIONS_KEY,
} from '@/lib/converted-pages/editor-adapter';
import {
  extractSectionOverrides,
  SECTION_OVERRIDES_KEY,
} from '@/lib/converted-pages/section-overrides';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import type { ConvertedSectionSpec } from '@/lib/converted-pages/types';

// Regression coverage for converted-page revision restore. The restore flow in
// RevisionHistory.tsx is a chain of pure transforms over the version's
// convertedContent — we test that data pipeline directly here. Component-level
// coverage would require React+DOM+fetch mocks for almost no extra signal.

const SPECS: ConvertedSectionSpec[] = [
  { key: 'hero', label: 'Hero', icon: '🦸' },
  { key: 'cta', label: 'CTA', icon: '🎯' },
  { key: 'features', label: 'Features', icon: '✨' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬' },
];

const PAGE_NAME = 'about';

// Realistic shape of the response from /api/admin/converted-page-content for
// a fictional "about" page. Kept synthetic so tests don't depend on the real
// content.ts (which evolves with marketing copy).
const BASE_CONTENT: Record<string, unknown> = {
  hero: { title: 'Welcome', subtitle: 'Default subtitle' },
  cta: { label: 'Click', href: '/contact' },
  features: { heading: 'Features' },
  testimonials: { heading: 'What clients say' },
};

// What a saved converted version's `version.convertedContent` looks like:
// scalar overrides, reorder, an extra duplicated instance, a soft-delete, a
// hidden section and per-section style overrides.
const VERSION_CONVERTED_CONTENT: Record<string, unknown> = {
  hero: { title: 'Edited Welcome', __hidden: true },
  features: { heading: 'Edited Features' },
  'features-2': { heading: 'Bonus Features' },
  [SECTION_ORDER_KEY]: ['hero', 'cta', 'features', 'features-2'],
  [SECTION_INSTANCES_KEY]: {
    'features-2': { templateKey: 'features', label: 'Features (copy)' },
  },
  [DELETED_SECTIONS_KEY]: ['testimonials'],
  [SECTION_OVERRIDES_KEY]: {
    hero: { desktop: { paddingTop: '40px' } },
  },
};

function buildEffectiveContent() {
  return mergeConvertedContent(BASE_CONTENT, VERSION_CONVERTED_CONTENT, PAGE_NAME) as Record<
    string,
    unknown
  >;
}

describe('converted-page revision restore pipeline', () => {
  it('restores ordering, duplicates, and soft-deletes from convertedContent', () => {
    const effective = buildEffectiveContent();
    const sections = convertedPageContentToSections(PAGE_NAME, effective, SPECS);

    // Order matches __sectionOrder, with the duplicate present and the soft-
    // deleted section absent.
    const orderedKeys = sections.map(
      (s) => s.columns[0]!.blocks[0]!.data.__sectionKey as string,
    );
    expect(orderedKeys).toEqual(['hero', 'cta', 'features', 'features-2']);
    expect(orderedKeys).not.toContain('testimonials');

    // Block types follow the *template* key (so duplicates reuse the same
    // runtime block definition the editor registered for the original).
    const blockTypes = sections.map((s) => s.columns[0]!.blocks[0]!.blockType);
    expect(blockTypes).toEqual([
      `cp-${PAGE_NAME}-hero`,
      `cp-${PAGE_NAME}-cta`,
      `cp-${PAGE_NAME}-features`,
      `cp-${PAGE_NAME}-features`,
    ]);
  });

  it('preserves __hidden as the editor-side __sectionHidden meta flag', () => {
    const effective = buildEffectiveContent();
    const sections = convertedPageContentToSections(PAGE_NAME, effective, SPECS);
    const heroBlock = sections[0]!.columns[0]!.blocks[0]!;
    expect(heroBlock.data.__sectionHidden).toBe(true);

    // Non-hidden sections don't carry the flag.
    const ctaBlock = sections[1]!.columns[0]!.blocks[0]!;
    expect(ctaBlock.data.__sectionHidden).toBeUndefined();
  });

  it('extracts the meta exactly as RevisionHistory.tsx would for setConvertedSectionMeta', () => {
    const effective = buildEffectiveContent();

    expect(extractSectionInstances(effective)).toEqual({
      'features-2': { templateKey: 'features', label: 'Features (copy)' },
    });
    expect(extractDeletedSections(effective)).toEqual(['testimonials']);
    expect(extractSectionOverrides(effective)).toEqual({
      hero: { desktop: { paddingTop: '40px' } },
    });
  });

  it('round-trips through sectionsToConvertedPageContent preserving order/instances/deleted/overrides/hidden', () => {
    const effective = buildEffectiveContent();
    const sections = convertedPageContentToSections(PAGE_NAME, effective, SPECS);

    const order = sections
      .map((s) => String(s.columns[0]?.blocks[0]?.data.__sectionKey ?? ''))
      .filter(Boolean);
    const rebuilt = sectionsToConvertedPageContent(effective, sections, {
      sectionOrder: order,
      sectionInstances: extractSectionInstances(effective),
      deletedSections: extractDeletedSections(effective),
    });

    expect(rebuilt[SECTION_ORDER_KEY]).toEqual(['hero', 'cta', 'features', 'features-2']);
    expect(rebuilt[SECTION_INSTANCES_KEY]).toEqual({
      'features-2': { templateKey: 'features', label: 'Features (copy)' },
    });
    expect(rebuilt[DELETED_SECTIONS_KEY]).toEqual(['testimonials']);
    // Style overrides aren't routed through sectionsToConvertedPageContent —
    // they live on the merged base content and survive the round-trip via the
    // structuredClone path.
    expect(rebuilt[SECTION_OVERRIDES_KEY]).toEqual({
      hero: { desktop: { paddingTop: '40px' } },
    });

    // Edited copy survives.
    expect((rebuilt.hero as Record<string, unknown>).title).toBe('Edited Welcome');
    expect((rebuilt.hero as Record<string, unknown>).__hidden).toBe(true);
    expect((rebuilt.features as Record<string, unknown>).heading).toBe('Edited Features');
    expect((rebuilt['features-2'] as Record<string, unknown>).heading).toBe('Bonus Features');
  });

  it('omits empty meta when nothing is duplicated/reordered/deleted (no-op restore)', () => {
    // A version with only scalar edits — no order/instances/deleted/overrides.
    const minimalOverride: Record<string, unknown> = {
      hero: { title: 'Just a copy edit' },
    };
    const merged = mergeConvertedContent(BASE_CONTENT, minimalOverride, PAGE_NAME) as Record<
      string,
      unknown
    >;
    const sections = convertedPageContentToSections(PAGE_NAME, merged, SPECS);
    const rebuilt = sectionsToConvertedPageContent(merged, sections, {
      sectionOrder: [],
      sectionInstances: {},
      deletedSections: [],
    });

    expect(rebuilt[SECTION_ORDER_KEY]).toBeUndefined();
    expect(rebuilt[SECTION_INSTANCES_KEY]).toBeUndefined();
    expect(rebuilt[DELETED_SECTIONS_KEY]).toBeUndefined();
    expect((rebuilt.hero as Record<string, unknown>).title).toBe('Just a copy edit');
  });
});
