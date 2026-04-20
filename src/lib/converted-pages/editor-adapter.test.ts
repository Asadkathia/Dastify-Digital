import { describe, it, expect } from 'vitest';
import {
  convertedPageContentToSections,
  sectionsToConvertedPageContent,
  buildConvertedBlockDefinition,
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
