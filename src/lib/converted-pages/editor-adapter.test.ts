import { describe, it, expect } from 'vitest';
import {
  convertedPageContentToSections,
  sectionsToConvertedPageContent,
  buildConvertedBlockDefinition,
  resolveRenderSections,
  SECTION_ORDER_KEY,
  SECTION_INSTANCES_KEY,
  DELETED_SECTIONS_KEY,
} from './editor-adapter';
import type { ConvertedSectionSpec } from './types';

const SPECS: ConvertedSectionSpec[] = [
  { key: 'hero', label: 'Hero', icon: '🦸' },
  { key: 'cta', label: 'CTA', icon: '🎯' },
];

describe('convertedPageContentToSections / sectionsToConvertedPageContent', () => {
  it('round-trips flat scalar content', () => {
    const content = {
      hero: { title: 'Hello', subtitle: 'World' },
      cta: { label: 'Click', href: '/x' },
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });

  it('round-trips nested object content via dotted paths', () => {
    const content = {
      hero: { logo: { text: 'Dastify', accent: '.Digital' } },
      cta: {},
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });

  it('round-trips simple array content (strings)', () => {
    const content = {
      hero: { tags: ['a', 'b', 'c'] },
      cta: {},
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });

  it('round-trips shallow array of objects', () => {
    const content = {
      hero: {
        links: [
          { label: 'About', href: '/about' },
          { label: 'Services', href: '/services' },
        ],
      },
      cta: {},
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });

  it('falls back to JSON string for deeply nested arrays and recovers on read', () => {
    const content = {
      hero: {
        // Array of arrays — too deep for the flat representation.
        matrix: [[1, 2, 3], [4, 5, 6]],
      },
      cta: {},
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    // The value in the block data should now be a string (JSON) — that is the
    // fallback pathway. The round-trip should still restore the structure.
    const blockData = sections[0].columns[0].blocks[0].data as Record<string, unknown>;
    expect(typeof blockData['matrix']).toBe('string');
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });

  it('preserves keys from baseContent that sections do not touch', () => {
    const baseContent = {
      hero: { title: 'old' },
      cta: { label: 'old cta' },
      footer: { copy: 'keep me' }, // not in SPECS — should survive untouched
    };
    const sections = convertedPageContentToSections('demo', baseContent, SPECS);
    // Mutate hero through the block data (simulate editor edit).
    (sections[0].columns[0].blocks[0].data as Record<string, unknown>)['title'] = 'new';
    const rebuilt = sectionsToConvertedPageContent(baseContent, sections) as {
      hero: { title: string };
      footer: { copy: string };
    };
    expect(rebuilt.hero.title).toBe('new');
    expect(rebuilt.footer.copy).toBe('keep me');
  });

  it('handles missing sections in content by defaulting to empty', () => {
    const content = { hero: { title: 'only hero' } }; // cta missing
    const sections = convertedPageContentToSections('demo', content, SPECS);
    expect(sections).toHaveLength(2);
    const ctaBlockData = sections[1].columns[0].blocks[0].data as Record<string, unknown>;
    // Meta fields are present; no content keys.
    const contentKeys = Object.keys(ctaBlockData).filter((k) => !k.startsWith('__'));
    expect(contentKeys).toEqual([]);
  });

  it('preserves media objects without flattening their fields', () => {
    const content = {
      hero: {
        image: { id: 7, url: '/m/7.png', alt: 'Logo', filename: '7.png', width: 100, height: 50, mimeType: 'image/png', filesize: 1234 },
      },
      cta: {},
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const blockData = sections[0].columns[0].blocks[0].data as Record<string, unknown>;
    // Media should remain as a single nested object under the "image" key, not
    // flattened to image.id, image.url etc.
    expect(blockData['image']).toEqual(content.hero.image);
    const rebuilt = sectionsToConvertedPageContent(content, sections);
    expect(rebuilt).toEqual(content);
  });
});

describe('resolveRenderSections / order, instances, deleted', () => {
  const SPECS = [
    { key: 'hero', label: 'Hero' },
    { key: 'services', label: 'Services' },
    { key: 'cta', label: 'CTA' },
  ] as const;

  it('returns registry order when no meta is present', () => {
    const out = resolveRenderSections(SPECS, { hero: {}, services: {}, cta: {} });
    expect(out.map((e) => e.key)).toEqual(['hero', 'services', 'cta']);
    expect(out.every((e) => e.key === e.templateKey)).toBe(true);
  });

  it('honours __sectionOrder', () => {
    const content = {
      hero: {},
      services: {},
      cta: {},
      [SECTION_ORDER_KEY]: ['cta', 'hero', 'services'],
    };
    const out = resolveRenderSections(SPECS, content);
    expect(out.map((e) => e.key)).toEqual(['cta', 'hero', 'services']);
  });

  it('skips keys in __deletedSections', () => {
    const content = {
      hero: {},
      services: {},
      cta: {},
      [DELETED_SECTIONS_KEY]: ['services'],
    };
    const out = resolveRenderSections(SPECS, content);
    expect(out.map((e) => e.key)).toEqual(['hero', 'cta']);
  });

  it('resolves duplicate instances to their template renderer', () => {
    const content = {
      hero: {},
      services: {},
      'services-2': {},
      cta: {},
      [SECTION_INSTANCES_KEY]: {
        'services-2': { templateKey: 'services', label: 'Services (copy)' },
      },
    };
    const out = resolveRenderSections(SPECS, content);
    // Default order: registry with duplicates appended right after their template.
    expect(out.map((e) => e.key)).toEqual(['hero', 'services', 'services-2', 'cta']);
    const dup = out.find((e) => e.key === 'services-2')!;
    expect(dup.templateKey).toBe('services');
  });

  it('combines order, instances, and deleted', () => {
    const content = {
      hero: {},
      services: {},
      'services-2': {},
      cta: {},
      [SECTION_INSTANCES_KEY]: {
        'services-2': { templateKey: 'services' },
      },
      [SECTION_ORDER_KEY]: ['cta', 'services-2', 'hero', 'services'],
      [DELETED_SECTIONS_KEY]: ['hero'],
    };
    const out = resolveRenderSections(SPECS, content);
    expect(out.map((e) => e.key)).toEqual(['cta', 'services-2', 'services']);
  });
});

describe('sectionsToConvertedPageContent / meta round-trip', () => {
  const SPECS: ConvertedSectionSpec[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'cta', label: 'CTA' },
  ];

  it('writes __sectionOrder, __sectionInstances, __deletedSections when provided', () => {
    const content = { hero: { title: 'h' }, cta: { label: 'c' } };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const out = sectionsToConvertedPageContent(content, sections, {
      sectionOrder: ['cta', 'hero'],
      sectionInstances: { 'cta-2': { templateKey: 'cta', label: 'CTA (copy)' } },
      deletedSections: ['hero'],
    });
    expect(out[SECTION_ORDER_KEY]).toEqual(['cta', 'hero']);
    expect(out[SECTION_INSTANCES_KEY]).toEqual({
      'cta-2': { templateKey: 'cta', label: 'CTA (copy)' },
    });
    expect(out[DELETED_SECTIONS_KEY]).toEqual(['hero']);
  });

  it('omits empty meta keys to keep saved content tidy', () => {
    const content = { hero: { title: 'h' }, cta: { label: 'c' } };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    const out = sectionsToConvertedPageContent(content, sections, {
      sectionOrder: [],
      sectionInstances: {},
      deletedSections: [],
    });
    expect(out[SECTION_ORDER_KEY]).toBeUndefined();
    expect(out[SECTION_INSTANCES_KEY]).toBeUndefined();
    expect(out[DELETED_SECTIONS_KEY]).toBeUndefined();
  });
});

describe('convertedPageContentToSections / order + duplicate', () => {
  const SPECS: ConvertedSectionSpec[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'cta', label: 'CTA' },
  ];

  it('builds sections in __sectionOrder when present and resolves duplicates via __sectionInstances', () => {
    const content = {
      hero: { title: 'Hi' },
      cta: { label: 'Go' },
      'cta-2': { label: 'Go again' },
      [SECTION_INSTANCES_KEY]: { 'cta-2': { templateKey: 'cta' } },
      [SECTION_ORDER_KEY]: ['cta-2', 'hero', 'cta'],
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    expect(sections.map((s) => String(s.columns[0].blocks[0].data.__sectionKey))).toEqual([
      'cta-2',
      'hero',
      'cta',
    ]);
    // The duplicate section's blockType should match its template's blockType
    // so the runtime block-definition lookup hits the same field config.
    const dupBlock = sections[0].columns[0].blocks[0];
    const ctaBlock = sections[2].columns[0].blocks[0];
    expect(dupBlock.blockType).toBe(ctaBlock.blockType);
    expect(dupBlock.data.__templateKey).toBe('cta');
  });

  it('skips deleted sections', () => {
    const content = {
      hero: { title: 'Hi' },
      cta: { label: 'Go' },
      [DELETED_SECTIONS_KEY]: ['cta'],
    };
    const sections = convertedPageContentToSections('demo', content, SPECS);
    expect(sections.map((s) => String(s.columns[0].blocks[0].data.__sectionKey))).toEqual(['hero']);
  });
});

describe('buildConvertedBlockDefinition field-type inference', () => {
  it('infers upload for known image field names', () => {
    const def = buildConvertedBlockDefinition('cp-demo-hero', 'Hero', '🦸', {
      logoImage: null,
      __jsonFields: [],
    });
    const field = def.fields.find((f) => f.name === 'logoImage');
    expect(field?.type).toBe('upload');
  });

  it('infers select for imagefit with expected options', () => {
    const def = buildConvertedBlockDefinition('cp-demo-hero', 'Hero', '🦸', {
      imageFit: 'cover',
      __jsonFields: [],
    });
    const field = def.fields.find((f) => f.name === 'imageFit');
    expect(field?.type).toBe('select');
    if (field?.type === 'select') {
      const values = field.options.map((o) => o.value);
      expect(values).toContain('cover');
      expect(values).toContain('contain');
      expect(values).toContain('scale-down');
    }
  });

  it('infers textarea for long strings when no specialized tail matches', () => {
    const longString = 'x'.repeat(200);
    const def = buildConvertedBlockDefinition('cp-demo-hero', 'Hero', '🦸', {
      description: longString,
      __jsonFields: [],
    });
    const field = def.fields.find((f) => f.name === 'description');
    expect(field?.type).toBe('textarea');
  });
});
