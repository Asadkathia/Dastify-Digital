import { describe, it, expect } from 'vitest';
import { smartLabel, categorizeField } from './field-labels';

describe('smartLabel', () => {
  it('humanizes a simple dotted heading path', () => {
    expect(smartLabel('hero.heading')).toBe('Heading');
  });

  it('formats <name>Cta.href as <Name> CTA URL', () => {
    expect(smartLabel('primaryCta.href')).toBe('Primary CTA URL');
  });

  it('formats <name>Cta.label as <Name> CTA Label', () => {
    expect(smartLabel('secondaryCta.label')).toBe('Secondary CTA Label');
  });

  it('returns "CTA Label" for ctaLabel single token', () => {
    expect(smartLabel('ctaLabel')).toBe('CTA Label');
  });

  it('returns "CTA URL" for ctaHref single token', () => {
    expect(smartLabel('ctaHref')).toBe('CTA URL');
  });

  it('returns "Image Alt Text" for tail alt', () => {
    expect(smartLabel('image.alt')).toBe('Image Alt Text');
  });

  it('returns "URL" for plain url tail', () => {
    expect(smartLabel('link.url')).toBe('URL');
  });

  it('returns "ID" for tail id', () => {
    expect(smartLabel('section.id')).toBe('ID');
  });

  it('returns "Slug" for tail slug', () => {
    expect(smartLabel('post.slug')).toBe('Slug');
  });

  it('splits camelCase on the leaf, dropping parent', () => {
    expect(smartLabel('pricing.plans.0.priceMonthly')).toBe('Price Monthly');
  });

  it('returns "Embed HTML" for embedHtml tail', () => {
    expect(smartLabel('media.embedHtml')).toBe('Embed HTML');
  });

  it('returns "Embed URL" / "Embed Code" for related tails', () => {
    expect(smartLabel('media.embedUrl')).toBe('Embed URL');
    expect(smartLabel('media.embedCode')).toBe('Embed Code');
  });
});

describe('categorizeField', () => {
  it('classifies json fields as Advanced', () => {
    expect(
      categorizeField({ name: 'rawJson', fieldType: 'textarea', isJsonField: true }),
    ).toBe('Advanced');
  });

  it('classifies upload fields as Images', () => {
    expect(
      categorizeField({ name: 'hero.image', fieldType: 'upload', isJsonField: false }),
    ).toBe('Images');
  });

  it('classifies icon-upload as Images', () => {
    expect(
      categorizeField({ name: 'feature.icon', fieldType: 'icon-upload', isJsonField: false }),
    ).toBe('Images');
  });

  it('classifies image-named fields by tail as Images even when text type', () => {
    expect(
      categorizeField({ name: 'hero.backgroundImage', fieldType: 'text', isJsonField: false }),
    ).toBe('Images');
  });

  it('classifies CTA paths as CTAs', () => {
    expect(
      categorizeField({ name: 'primaryCta.href', fieldType: 'text', isJsonField: false }),
    ).toBe('CTAs');
  });

  it('classifies bare ctaLabel as CTAs', () => {
    expect(
      categorizeField({ name: 'ctaLabel', fieldType: 'text', isJsonField: false }),
    ).toBe('CTAs');
  });

  it('classifies href/url/link tails as CTAs', () => {
    expect(
      categorizeField({ name: 'social.url', fieldType: 'text', isJsonField: false }),
    ).toBe('CTAs');
  });

  it('classifies meta.* as SEO', () => {
    expect(
      categorizeField({ name: 'meta.title', fieldType: 'text', isJsonField: false }),
    ).toBe('SEO');
  });

  it('classifies seo.* as SEO', () => {
    expect(
      categorizeField({ name: 'seo.description', fieldType: 'textarea', isJsonField: false }),
    ).toBe('SEO');
  });

  it('classifies arrays as Lists', () => {
    expect(
      categorizeField({ name: 'plans', fieldType: 'array', isJsonField: false }),
    ).toBe('Lists');
  });

  it('classifies form-related fields as Forms', () => {
    expect(
      categorizeField({ name: 'form.fields', fieldType: 'text', isJsonField: false }),
    ).toBe('Forms');
    expect(
      categorizeField({ name: 'contact.formId', fieldType: 'text', isJsonField: false }),
    ).toBe('Forms');
  });

  it('classifies plain text fields as Content by default', () => {
    expect(
      categorizeField({ name: 'hero.heading', fieldType: 'text', isJsonField: false }),
    ).toBe('Content');
  });
});
