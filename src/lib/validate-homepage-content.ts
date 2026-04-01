import type { HomepageContent } from './homepage-content.ts';

type ValidationResult = true | string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasString(record: Record<string, unknown>, key: string): boolean {
  return typeof record[key] === 'string';
}

function hasStringArray(record: Record<string, unknown>, key: string): boolean {
  return Array.isArray(record[key]) && (record[key] as unknown[]).every((item) => typeof item === 'string');
}

function validateLinkItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && hasString(item, 'label') && hasString(item, 'href'))
  );
}

function validateIdLabelItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        (typeof item.id === 'string' || typeof item.id === 'number') &&
        hasString(item, 'label'),
    )
  );
}

function validateFooterColumns(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        hasString(item, 'title') &&
        validateLinkItems(item.links) &&
        (item.button === undefined || typeof item.button === 'string'),
    )
  );
}

function validateBrandItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        hasString(item, 'l') &&
        hasString(item, 'word') &&
        hasString(item, 'dir') &&
        hasString(item, 'color') &&
        hasString(item, 't1') &&
        hasString(item, 't2'),
    )
  );
}

function validateCardItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        hasString(item, 'category') &&
        hasString(item, 'title') &&
        hasString(item, 'description') &&
        hasString(item, 'image') &&
        hasString(item, 'alt'),
    )
  );
}

function validateFaqItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && hasString(item, 'question') && hasString(item, 'answer'))
  );
}

function validateSectionIds(content: Record<string, unknown>): boolean {
  return (
    isRecord(content.hero) &&
    hasString(content.hero, 'id') &&
    isRecord(content.about) &&
    hasString(content.about, 'id') &&
    isRecord(content.brandAcronym) &&
    hasString(content.brandAcronym, 'id') &&
    isRecord(content.caseStudies) &&
    hasString(content.caseStudies, 'id') &&
    isRecord(content.services) &&
    hasString(content.services, 'id') &&
    isRecord(content.insights) &&
    hasString(content.insights, 'id') &&
    isRecord(content.faq) &&
    hasString(content.faq, 'id')
  );
}

export function validateHomepageContent(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return 'Homepage content must be a JSON object.';
  }

  const content = value as Record<string, unknown>;
  const requiredSections = [
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
  ];

  const missing = requiredSections.filter((key) => !isRecord(content[key]));
  if (missing.length > 0) {
    return `Homepage content is missing required sections: ${missing.join(', ')}.`;
  }

  if (!validateSectionIds(content)) {
    return 'Homepage section IDs are invalid or missing.';
  }

  const nav = content.nav as Record<string, unknown>;
  if (!hasString(nav, 'logo') || !hasString(nav, 'cta') || !validateLinkItems(nav.links)) {
    return 'Invalid nav content. Expected logo, cta, and links[].';
  }

  const hero = content.hero as Record<string, unknown>;
  if (
    !hasString(hero, 'chip') ||
    !hasString(hero, 'description') ||
    !hasString(hero, 'primaryCta') ||
    !hasString(hero, 'secondaryCta') ||
    !hasString(hero, 'image') ||
    !hasString(hero, 'imageAlt') ||
    !hasString(hero, 'badgeValue') ||
    !hasString(hero, 'badgeLabel') ||
    !hasStringArray(hero, 'marquee')
  ) {
    return 'Invalid hero content.';
  }

  const brandAcronym = content.brandAcronym as Record<string, unknown>;
  if (
    !hasString(brandAcronym, 'chip') ||
    !hasString(brandAcronym, 'title') ||
    !hasString(brandAcronym, 'subtitle') ||
    !validateBrandItems(brandAcronym.items)
  ) {
    return 'Invalid brandAcronym content.';
  }

  const about = content.about as Record<string, unknown>;
  if (
    !hasString(about, 'chip') ||
    !hasString(about, 'cta') ||
    !hasString(about, 'image') ||
    !hasString(about, 'imageAlt') ||
    !hasStringArray(about, 'paragraphs')
  ) {
    return 'Invalid about content.';
  }

  const features = content.features as Record<string, unknown>;
  if (!validateCardItems(features.cards)) {
    return 'Invalid features content.';
  }

  const caseStudies = content.caseStudies as Record<string, unknown>;
  if (
    !hasString(caseStudies, 'chip') ||
    !hasString(caseStudies, 'title') ||
    !hasString(caseStudies, 'cta') ||
    !validateIdLabelItems(caseStudies.tabs) ||
    !isRecord(caseStudies.main) ||
    !Array.isArray(caseStudies.minis)
  ) {
    return 'Invalid caseStudies content.';
  }

  const services = content.services as Record<string, unknown>;
  if (
    !hasString(services, 'chip') ||
    !hasString(services, 'description') ||
    !hasStringArray(services, 'titleLines') ||
    !Array.isArray(services.items)
  ) {
    return 'Invalid services content.';
  }

  const mission = content.mission as Record<string, unknown>;
  if (
    !hasString(mission, 'chip') ||
    !hasString(mission, 'title') ||
    !hasString(mission, 'description') ||
    !hasString(mission, 'cta') ||
    !hasString(mission, 'image') ||
    !hasString(mission, 'imageAlt') ||
    !hasStringArray(mission, 'checks')
  ) {
    return 'Invalid mission content.';
  }

  const insights = content.insights as Record<string, unknown>;
  if (
    !hasString(insights, 'chip') ||
    !hasString(insights, 'title') ||
    !hasString(insights, 'cta') ||
    !Array.isArray(insights.items)
  ) {
    return 'Invalid insights content.';
  }

  const faq = content.faq as Record<string, unknown>;
  if (
    !hasString(faq, 'chip') ||
    !hasString(faq, 'title') ||
    !hasString(faq, 'intro') ||
    !hasString(faq, 'cta') ||
    !validateFaqItems(faq.items)
  ) {
    return 'Invalid faq content.';
  }

  const cta = content.cta as Record<string, unknown>;
  if (
    !hasString(cta, 'chip') ||
    !hasString(cta, 'subtitle') ||
    !hasString(cta, 'inputPlaceholder') ||
    !hasString(cta, 'button') ||
    !hasString(cta, 'note')
  ) {
    return 'Invalid cta content.';
  }

  const footer = content.footer as Record<string, unknown>;
  if (
    !hasString(footer, 'logo') ||
    !hasString(footer, 'tagline') ||
    !hasString(footer, 'copyright') ||
    !validateLinkItems(footer.socials) ||
    !validateFooterColumns(footer.columns)
  ) {
    return 'Invalid footer content.';
  }

  return true;
}

export function assertHomepageContent(value: unknown): asserts value is HomepageContent {
  const result = validateHomepageContent(value);
  if (result !== true) {
    throw new Error(result);
  }
}
