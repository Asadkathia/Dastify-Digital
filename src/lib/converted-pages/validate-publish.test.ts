import { describe, it, expect } from 'vitest';
import { validateConvertedPagePublish } from './validate-publish';

describe('validateConvertedPagePublish', () => {
  it('returns canPublish for empty/null content', () => {
    expect(validateConvertedPagePublish(null)).toEqual({
      blocks: [],
      warnings: [],
      canPublish: true,
    });
    expect(validateConvertedPagePublish(undefined)).toEqual({
      blocks: [],
      warnings: [],
      canPublish: true,
    });
    expect(validateConvertedPagePublish({})).toEqual({
      blocks: [],
      warnings: [],
      canPublish: true,
    });
  });

  it('blocks CTA object with label but empty href', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Click', href: '' } },
    });
    expect(r.canPublish).toBe(false);
    expect(r.blocks.some((b) => b.code === 'cta_label_without_url')).toBe(true);
  });

  it('blocks CTA object with href but empty label', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: '', href: '/x' } },
    });
    expect(r.canPublish).toBe(false);
    expect(r.blocks.some((b) => b.code === 'cta_url_without_label')).toBe(true);
  });

  it('blocks path-style CTA where label set and href missing as field', () => {
    // primaryCta has only `label`, no href/url field at all.
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Click' } },
    });
    expect(r.canPublish).toBe(false);
    expect(r.blocks.some((b) => b.code === 'cta_label_without_url')).toBe(true);
  });

  it('allows internal /about links', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'About', href: '/about' } },
    });
    expect(r.blocks.filter((b) => b.code === 'malformed_external_url')).toHaveLength(0);
    expect(r.canPublish).toBe(true);
  });

  it('allows anchor #section links', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Jump', href: '#section' } },
    });
    expect(r.blocks.filter((b) => b.code === 'malformed_external_url')).toHaveLength(0);
    expect(r.canPublish).toBe(true);
  });

  it('allows valid https external URL', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Site', href: 'https://example.com/path' } },
    });
    expect(r.blocks).toHaveLength(0);
    expect(r.canPublish).toBe(true);
  });

  it('blocks malformed https URL', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Bad', href: 'https://??not a url??' } },
    });
    expect(r.blocks.some((b) => b.code === 'malformed_external_url')).toBe(true);
  });

  it('blocks bare hostname without scheme', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Bare', href: 'example.com/foo' } },
    });
    expect(r.blocks.some((b) => b.code === 'malformed_external_url')).toBe(true);
  });

  it('allows valid mailto:', () => {
    const r = validateConvertedPagePublish({
      contact: { primaryCta: { label: 'Email', href: 'mailto:foo@bar.com' } },
    });
    expect(r.blocks.filter((b) => b.code === 'malformed_mailto')).toHaveLength(0);
    expect(r.canPublish).toBe(true);
  });

  it('blocks malformed mailto', () => {
    const r = validateConvertedPagePublish({
      contact: { primaryCta: { label: 'Email', href: 'mailto:not-an-email' } },
    });
    expect(r.blocks.some((b) => b.code === 'malformed_mailto')).toBe(true);
  });

  it('allows valid tel:', () => {
    const r = validateConvertedPagePublish({
      contact: { primaryCta: { label: 'Call', href: 'tel:+1-555-1234' } },
    });
    expect(r.blocks.filter((b) => b.code === 'malformed_tel')).toHaveLength(0);
    expect(r.canPublish).toBe(true);
  });

  it('blocks malformed tel:', () => {
    const r = validateConvertedPagePublish({
      contact: { primaryCta: { label: 'Call', href: 'tel:abc def' } },
    });
    expect(r.blocks.some((b) => b.code === 'malformed_tel')).toBe(true);
  });

  it('warns when media object has url but empty alt', () => {
    const r = validateConvertedPagePublish({
      hero: { image: { url: '/img.png', alt: '' } },
    });
    expect(r.warnings.some((w) => w.code === 'image_missing_alt')).toBe(true);
    expect(r.canPublish).toBe(true);
  });

  it('does not warn when media object has alt', () => {
    const r = validateConvertedPagePublish({
      hero: { image: { url: '/img.png', alt: 'fine' } },
    });
    expect(r.warnings.filter((w) => w.code === 'image_missing_alt')).toHaveLength(0);
  });

  it('warns when string image has empty named alt companion', () => {
    const r = validateConvertedPagePublish({
      hero: { image: '/img.png', imageAlt: '' },
    });
    expect(r.warnings.some((w) => w.code === 'image_missing_alt')).toBe(true);
  });

  it('does not warn when string image has no alt companion (decorative)', () => {
    const r = validateConvertedPagePublish({
      hero: { background: '/bg.png' },
    });
    expect(r.warnings.filter((w) => w.code === 'image_missing_alt')).toHaveLength(0);
  });

  it('warns for sections marked __hidden', () => {
    const r = validateConvertedPagePublish({
      hero: { title: 'X', __hidden: true },
    });
    const w = r.warnings.find((x) => x.code === 'section_hidden');
    expect(w).toBeDefined();
    expect(w?.sectionKey).toBe('hero');
  });

  it('warns for __deletedSections', () => {
    const r = validateConvertedPagePublish({
      __deletedSections: ['hero', 'cta'],
    });
    const matches = r.warnings.filter((w) => w.code === 'deleted_sections');
    expect(matches).toHaveLength(1);
    expect(matches[0].message).toContain('hero');
    expect(matches[0].message).toContain('cta');
  });

  it('warns for __sectionInstances', () => {
    const r = validateConvertedPagePublish({
      __sectionInstances: { 'hero-2': { templateKey: 'hero' } },
    });
    const matches = r.warnings.filter((w) => w.code === 'duplicate_sections');
    expect(matches).toHaveLength(1);
    expect(matches[0].message).toContain('hero');
  });

  it('warns for suspicious external URL (staging)', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'Go', href: 'https://staging.example.com' } },
    });
    expect(r.warnings.some((w) => w.code === 'suspicious_external_url')).toBe(true);
    expect(r.canPublish).toBe(true);
  });

  it('returns multiple block issues, canPublish false', () => {
    const r = validateConvertedPagePublish({
      hero: { primaryCta: { label: 'A', href: '' } },
      cta: { secondaryCta: { label: '', href: 'mailto:not-valid' } },
    });
    expect(r.blocks.length).toBeGreaterThanOrEqual(2);
    expect(r.canPublish).toBe(false);
  });

  it('clean content yields no warnings or blocks', () => {
    const r = validateConvertedPagePublish({
      hero: {
        title: 'Hi',
        primaryCta: { label: 'Go', href: '/go' },
        image: { url: '/h.png', alt: 'Hero illustration' },
      },
    });
    expect(r.blocks).toEqual([]);
    expect(r.warnings).toEqual([]);
    expect(r.canPublish).toBe(true);
  });

  it('does not walk reserved/editor keys (no false positives)', () => {
    const r = validateConvertedPagePublish({
      hero: {
        title: 'Hi',
        editor: { nodes: { foo: { url: 'not-a-url-but-ignored.com/x' } } },
        _sectionOverrides: { foo: { href: 'mailto:bad' } },
      },
      __sectionOrder: ['hero'],
    });
    expect(r.blocks).toEqual([]);
  });

  it('honors a custom suspiciousDomains list', () => {
    const r = validateConvertedPagePublish(
      {
        hero: { primaryCta: { label: 'Go', href: 'https://internal.corp/x' } },
      },
      { suspiciousDomains: ['internal.corp'] },
    );
    expect(r.warnings.some((w) => w.code === 'suspicious_external_url')).toBe(true);
  });
});
