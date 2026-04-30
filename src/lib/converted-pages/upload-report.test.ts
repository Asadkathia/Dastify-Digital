import { describe, it, expect } from 'vitest';
import { buildUploadReport } from './upload-report';

const aboutRegistry = [
  { key: 'hero', label: 'Hero' },
  { key: 'mission', label: 'Mission' },
  { key: 'values', label: 'Values' },
];

function baseInput(overrides: Partial<Parameters<typeof buildUploadReport>[0]> = {}) {
  return {
    action: 'created' as const,
    pageId: 'page-1',
    slug: 'about',
    title: 'About',
    convertedPageName: 'about',
    convertedContent: {
      hero: { title: 'Hello', subtitle: 'World' },
    } as Record<string, unknown>,
    blocks: [] as ReadonlyArray<{ blockType?: string }>,
    registrySections: aboutRegistry,
    formIds: {},
    ...overrides,
  };
}

describe('buildUploadReport', () => {
  it('surfaces created action', () => {
    const r = buildUploadReport(baseInput({ action: 'created' }));
    expect(r.action).toBe('created');
  });

  it('surfaces updated action', () => {
    const r = buildUploadReport(baseInput({ action: 'updated' }));
    expect(r.action).toBe('updated');
  });

  it('round-trips pageId, slug, title, convertedPageName', () => {
    const r = buildUploadReport(
      baseInput({ pageId: 'p-9', slug: 'about', title: 'About Us', convertedPageName: 'about' }),
    );
    expect(r.pageId).toBe('p-9');
    expect(r.slug).toBe('about');
    expect(r.title).toBe('About Us');
    expect(r.convertedPageName).toBe('about');
  });

  it('derives sectionCount from resolveRenderSections output', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 'a' },
          mission: { title: 'b' },
        },
      }),
    );
    // resolveRenderSections returns one entry per registry key (data may be empty)
    expect(r.sectionCount).toBe(aboutRegistry.length);
    expect(r.sections.map((s) => s.key)).toEqual(['hero', 'mission', 'values']);
  });

  it('flags duplicate section instances', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 'a' },
          'hero-2': { title: 'b' },
          __sectionInstances: { 'hero-2': { templateKey: 'hero', label: 'Hero (copy)' } },
        },
      }),
    );
    const dup = r.sections.find((s) => s.key === 'hero-2');
    expect(dup?.isDuplicate).toBe(true);
    expect(dup?.templateKey).toBe('hero');
    expect(dup?.label).toBe('Hero (copy)');
    expect(r.duplicateSections).toEqual(['hero-2']);
  });

  it('populates deletedSections list from __deletedSections', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 'a' },
          __deletedSections: ['mission'],
        },
      }),
    );
    expect(r.deletedSections).toEqual(['mission']);
  });

  it('reports hidden:true for __hidden section', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 'a', __hidden: true },
        },
      }),
    );
    expect(r.sections[0]?.hidden).toBe(true);
  });

  it('editableFieldCount excludes __* and editor.* keys', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 'a',
            subtitle: 'b',
            __hidden: true,
            editor: { nodes: { title: { tag: 'h1' } } },
          },
        },
      }),
    );
    expect(r.editableFieldCount).toBe(2);
  });

  it('imageCount counts media objects + image-tail strings', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://example.com/foo.jpg',
            logo: { id: 1, url: '/logo.png', alt: 'L' },
          },
        },
      }),
    );
    const hero = r.sections.find((s) => s.key === 'hero');
    expect(hero?.imageCount).toBe(2);
  });

  it('ctaCount counts CTA-shaped objects', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            primaryCta: { label: 'Go', href: '/x' },
          },
        },
      }),
    );
    const hero = r.sections.find((s) => s.key === 'hero');
    expect(hero?.ctaCount).toBe(1);
  });

  it('imageFields lists every image with paths', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://example.com/a.jpg',
            logo: { id: 1, url: '/logo.png', alt: 'L' },
          },
        },
      }),
    );
    const paths = r.imageFields.map((i) => i.path).sort();
    expect(paths).toEqual(['hero.image', 'hero.logo']);
  });

  it('imagesMissingAlt is the subset where url is set but alt is empty', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://example.com/a.jpg',
            imageAlt: '',
            logo: { id: 1, url: '/logo.png', alt: 'L' },
          },
        },
      }),
    );
    expect(r.imagesMissingAlt.map((i) => i.path)).toEqual(['hero.image']);
  });

  it('ctaFields lists path/label/href', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 't', primaryCta: { label: 'Go', href: '/x' } },
        },
      }),
    );
    expect(r.ctaFields.length).toBeGreaterThan(0);
    const cta = r.ctaFields.find((c) => c.path === 'hero.primaryCta');
    expect(cta?.label).toBe('Go');
    expect(cta?.href).toBe('/x');
  });

  it('forms list populated from formIds map', () => {
    const r = buildUploadReport(
      baseInput({ formIds: { contact: 42 }, convertedContent: { hero: { title: 't' } } }),
    );
    expect(r.forms).toEqual([{ sectionKey: 'contact', formId: 42 }]);
  });

  it('forms list also picks up formId in section data', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 't' },
          contact: { title: 'c', formId: 'form-7' },
        },
      }),
    );
    expect(r.forms).toEqual([{ sectionKey: 'contact', formId: 'form-7' }]);
  });

  it('forms dedup by sectionKey across formIds + content scan', () => {
    const r = buildUploadReport(
      baseInput({
        formIds: { contact: 'form-7' },
        convertedContent: {
          hero: { title: 't' },
          contact: { title: 'c', formId: 'form-7' },
        },
      }),
    );
    expect(r.forms).toHaveLength(1);
    expect(r.forms[0]?.formId).toBe('form-7');
  });

  it('includes unsupported_section warning for unknown keys when registry passed', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 't' },
          mystery: { foo: 'bar' },
        },
      }),
    );
    expect(r.warnings.some((w) => w.code === 'unsupported_section')).toBe(true);
  });

  it('does not flag meta/seo/heroVariant as unsupported_section', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: { title: 't' },
          meta: { title: 'SEO title', description: 'desc' },
          seo: { canonicalURL: '/x' },
          heroVariant: 'B',
        },
      }),
    );
    const offenders = r.warnings
      .filter((w) => w.code === 'unsupported_section')
      .map((w) => w.sectionKey);
    expect(offenders).not.toContain('meta');
    expect(offenders).not.toContain('seo');
    expect(offenders).not.toContain('heroVariant');
  });

  it('skips unsupported_section when registry is empty', () => {
    const r = buildUploadReport(
      baseInput({
        registrySections: [],
        convertedContent: { random: { foo: 'bar' } },
        convertedPageName: null,
      }),
    );
    expect(r.warnings.some((w) => w.code === 'unsupported_section')).toBe(false);
  });

  it('includes no_editable_fields when section has zero leaves', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: { hero: {} },
      }),
    );
    expect(r.warnings.some((w) => w.code === 'no_editable_fields')).toBe(true);
  });

  it('includes external_image_url for http(s) images not matching baseUrl host', () => {
    const r = buildUploadReport(
      baseInput({
        baseUrl: 'https://dastify.com',
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://cdn.othersite.com/foo.jpg',
            imageAlt: 'x',
          },
        },
      }),
    );
    expect(r.warnings.some((w) => w.code === 'external_image_url')).toBe(true);
  });

  it('does NOT flag external_image_url for same-origin URLs', () => {
    const r = buildUploadReport(
      baseInput({
        baseUrl: 'https://dastify.com',
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://dastify.com/foo.jpg',
            imageAlt: 'x',
          },
        },
      }),
    );
    expect(r.warnings.some((w) => w.code === 'external_image_url')).toBe(false);
  });

  it('emits missing_alt_text warning per image-with-missing-alt', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            image: 'https://example.com/a.jpg',
            imageAlt: '',
          },
        },
      }),
    );
    expect(r.warnings.filter((w) => w.code === 'missing_alt_text')).toHaveLength(1);
  });

  it('emits conversion_fallback_html when blocks contain custom-html-block', () => {
    const r = buildUploadReport(
      baseInput({
        blocks: [{ blockType: 'custom-html-block' }],
      }),
    );
    expect(r.warnings.some((w) => w.code === 'conversion_fallback_html')).toBe(true);
    expect(r.hasCustomHtmlFallback).toBe(true);
  });

  it('promotes validate-publish block codes (cta_*, malformed_*) to severity=warn', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            primaryCta: { label: 'Click', href: '' },
          },
        },
      }),
    );
    const ctaW = r.warnings.find((w) => w.code === 'cta_label_without_url');
    expect(ctaW).toBeDefined();
    expect(ctaW?.severity).toBe('warn');
    expect(ctaW?.message).toMatch(/Publish will be blocked/);
  });

  it('reuses validate-publish suspicious_external_url warnings', () => {
    const r = buildUploadReport(
      baseInput({
        convertedContent: {
          hero: {
            title: 't',
            primaryCta: { label: 'Stage', href: 'https://staging.example.com/x' },
          },
        },
      }),
    );
    expect(r.warnings.some((w) => w.code === 'suspicious_external_url')).toBe(true);
  });

  it('nextActions includes all 4 entries with correct hrefs', () => {
    const r = buildUploadReport(baseInput({ pageId: 'p-1', slug: 'about', convertedPageName: 'about' }));
    expect(r.nextActions).toHaveLength(4);
    expect(r.nextActions[0]).toMatchObject({
      kind: 'open_visual_editor',
      href: '/admin/edit-converted-page/about',
    });
    expect(r.nextActions[1]).toMatchObject({
      kind: 'open_payload_page',
      href: '/admin/collections/pages/p-1',
    });
    expect(r.nextActions[2]).toMatchObject({
      kind: 'open_public_page',
      href: '/about',
    });
    expect(r.nextActions[3]).toMatchObject({ kind: 'rerun_upload', href: '#' });
  });

  it('falls back to /admin/visual-editor/<pageId> when convertedPageName is null', () => {
    const r = buildUploadReport(
      baseInput({ convertedPageName: null, pageId: 'p-7', registrySections: [] }),
    );
    const va = r.nextActions.find((a) => a.kind === 'open_visual_editor');
    expect(va?.href).toBe('/admin/visual-editor/p-7');
  });

  it('public href for slug=home is /', () => {
    const r = buildUploadReport(baseInput({ slug: 'home' }));
    const pub = r.nextActions.find((a) => a.kind === 'open_public_page');
    expect(pub?.href).toBe('/');
  });

  it('null convertedContent yields a minimal report with no crashes', () => {
    const r = buildUploadReport(
      baseInput({ convertedContent: null, registrySections: [], convertedPageName: null }),
    );
    expect(r.sectionCount).toBe(0);
    expect(r.editableFieldCount).toBe(0);
    expect(r.imageFields).toEqual([]);
    expect(r.ctaFields).toEqual([]);
    expect(r.warnings.find((w) => w.code === 'unsupported_section')).toBeUndefined();
  });

  it('empty registry still produces a report and skips registry-dependent warnings', () => {
    const r = buildUploadReport(
      baseInput({
        registrySections: [],
        convertedPageName: null,
        convertedContent: { random: { foo: 'bar' } },
      }),
    );
    expect(r.isRegisteredConverted).toBe(false);
    expect(r.sections).toEqual([]);
    expect(r.warnings.some((w) => w.code === 'no_editable_fields')).toBe(false);
  });

  it('emits missing_cms_page when pageId is empty', () => {
    const r = buildUploadReport(baseInput({ pageId: '' }));
    expect(r.warnings.some((w) => w.code === 'missing_cms_page')).toBe(true);
  });
});
