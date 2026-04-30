// Regression tests for the catch-all converted-page renderer
// (`src/app/(site)/[...slug]/page.tsx`). It used to ignore `__sectionOrder`,
// `__sectionInstances`, `__deletedSections`, and `__hidden`. Now it routes
// through `resolveRenderSections`. These tests pin the contract so the catch-all
// can't silently regress to the old behavior.
import { describe, it, expect } from 'vitest';
import {
  resolveRenderSections,
  SECTION_ORDER_KEY,
  SECTION_INSTANCES_KEY,
  DELETED_SECTIONS_KEY,
} from './editor-adapter';
import {
  extractSectionOverrides,
  SECTION_OVERRIDES_KEY,
  type SectionOverrides,
} from './section-overrides';
import type { ConvertedSectionSpec } from './types';

const REGISTRY: ConvertedSectionSpec[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'features', label: 'Features' },
  { key: 'cta', label: 'CTA' },
];

describe('resolveRenderSections — catch-all renderer regression', () => {
  it('1. default order: returns sections in registry order when no meta is present', () => {
    const out = resolveRenderSections(REGISTRY, { hero: {}, features: {}, cta: {} });
    expect(out.map((e) => e.key)).toEqual(['hero', 'features', 'cta']);
    // templateKey === key for non-duplicate entries.
    expect(out.every((e) => e.templateKey === e.key)).toBe(true);
  });

  it('2. custom order: __sectionOrder dictates output order regardless of registry order', () => {
    const content = {
      hero: {},
      features: {},
      cta: {},
      [SECTION_ORDER_KEY]: ['hero', 'cta', 'features'],
    };
    const out = resolveRenderSections(REGISTRY, content);
    expect(out.map((e) => e.key)).toEqual(['hero', 'cta', 'features']);
  });

  it('3. duplicates: __sectionInstances produces extra entries with distinct keys but shared templateKey', () => {
    // Note: actual instance map shape is { instanceKey: { templateKey, label? } }.
    // The page reads section data from `convertedContent[entry.key]`, so the
    // duplicated entry's `key` must match the persisted slot (here `hero-2`).
    const content = {
      hero: { title: 'first hero' },
      'hero-2': { title: 'second hero' },
      features: {},
      cta: {},
      [SECTION_INSTANCES_KEY]: {
        'hero-2': { templateKey: 'hero', label: 'Hero (copy)' },
      },
    };
    const out = resolveRenderSections(REGISTRY, content);
    // Default-order rule: duplicate is appended right after its template.
    expect(out.map((e) => e.key)).toEqual(['hero', 'hero-2', 'features', 'cta']);
    const heroEntries = out.filter((e) => e.templateKey === 'hero');
    expect(heroEntries).toHaveLength(2);
    expect(heroEntries.map((e) => e.key)).toEqual(['hero', 'hero-2']);
    // The catch-all uses entry.key to read data: confirm that lookup works.
    const dup = heroEntries[1];
    expect((content as Record<string, unknown>)[dup.key]).toEqual({ title: 'second hero' });
  });

  it('4. deleted: keys present in __deletedSections are excluded from output', () => {
    const content = {
      hero: {},
      features: {},
      cta: {},
      [DELETED_SECTIONS_KEY]: ['features'],
    };
    const out = resolveRenderSections(REGISTRY, content);
    expect(out.map((e) => e.key)).toEqual(['hero', 'cta']);
    expect(out.find((e) => e.key === 'features')).toBeUndefined();
  });

  it('4b. deleted also excludes duplicate-instance keys', () => {
    const content = {
      hero: {},
      features: {},
      'features-2': {},
      cta: {},
      [SECTION_INSTANCES_KEY]: { 'features-2': { templateKey: 'features' } },
      [DELETED_SECTIONS_KEY]: ['features-2'],
    };
    const out = resolveRenderSections(REGISTRY, content);
    expect(out.map((e) => e.key)).toEqual(['hero', 'features', 'cta']);
  });

  it('5. __hidden is NOT pre-filtered by the resolver — the renderer is responsible for skipping', () => {
    // Per [...slug]/page.tsx: the resolver returns the entry; the page checks
    // `sectionData.__hidden` and returns null. Pin the resolver-side contract so
    // we don't accidentally start filtering here too (which would hide the
    // section's data from any renderer that wants to show a placeholder).
    const content = {
      hero: { __hidden: true, title: 'hidden but present' },
      features: {},
      cta: {},
    };
    const out = resolveRenderSections(REGISTRY, content);
    expect(out.map((e) => e.key)).toEqual(['hero', 'features', 'cta']);
  });
});

describe('extractSectionOverrides — round-trip', () => {
  it('6. returns persisted overrides untouched when present', () => {
    const overrides: SectionOverrides = {
      hero: {
        desktop: { paddingTop: '40px', paddingBottom: '40px' },
        mobile: { paddingTop: '16px' },
      },
      cta: { desktop: { marginTop: '24px' } },
    };
    const content = {
      hero: {},
      cta: {},
      [SECTION_OVERRIDES_KEY]: overrides,
    };
    const out = extractSectionOverrides(content);
    expect(out).toEqual(overrides);
    // Same reference is fine — the function isn't claimed to clone.
    expect(out).toBe(overrides);
  });

  it('6b. returns {} when the overrides key is absent', () => {
    expect(extractSectionOverrides({ hero: {} })).toEqual({});
  });

  it('6c. returns {} for null/undefined content', () => {
    expect(extractSectionOverrides(null)).toEqual({});
    expect(extractSectionOverrides(undefined)).toEqual({});
  });

  it('6d. returns {} when the value at the overrides key is the wrong shape', () => {
    expect(extractSectionOverrides({ [SECTION_OVERRIDES_KEY]: 'nope' })).toEqual({});
    expect(extractSectionOverrides({ [SECTION_OVERRIDES_KEY]: ['array'] })).toEqual({});
    expect(extractSectionOverrides({ [SECTION_OVERRIDES_KEY]: null })).toEqual({});
  });
});
