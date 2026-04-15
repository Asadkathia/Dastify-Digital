import { homepageContent, type HomepageContent, type CmsLinkValue } from './homepage-content.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function asMediaURL(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.url === 'string' && value.url.length > 0) {
    return value.url;
  }

  return null;
}

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function asStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (isRecord(item) && typeof item.text === 'string') {
        return item.text;
      }
      return '';
    })
    .filter((item) => item.length > 0);
}

function asLinkValue(value: unknown): CmsLinkValue | undefined {
  if (!isRecord(value)) return undefined;
  const url = typeof value.url === 'string' ? value.url : '';
  const type = (value.type === 'internal' || value.type === 'anchor') ? value.type : 'external';
  const openInNewTab = value.openInNewTab === true;
  return { url, type, openInNewTab };
}

function normalizeCaseStudiesMain(
  value: unknown,
  fallback: HomepageContent['caseStudies']['main'],
): HomepageContent['caseStudies']['main'] {
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    tag: asString(value.tag, fallback.tag),
    title: asString(value.title, fallback.title),
    description: asString(value.description, fallback.description),
    stat: asString(value.stat, fallback.stat),
    statLabel: asString(value.statLabel, fallback.statLabel),
    image: asMediaURL(value.imageMedia) ?? asString(value.image, fallback.image),
    alt: asString(value.alt, fallback.alt),
  };
}

function normalizeCaseTabs(
  value: unknown,
  fallback: HomepageContent['caseStudies']['tabs'],
): HomepageContent['caseStudies']['tabs'] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }
      const label = asString(item.label, fallback[index]?.label ?? '');
      if (!label) {
        return null;
      }
      const rawId = typeof item.id === 'string' || typeof item.id === 'number' ? String(item.id) : '';
      const id = rawId || fallback[index]?.id || label.toLowerCase().replace(/\s+/g, '-');
      return { id, label };
    })
    .filter((item): item is HomepageContent['caseStudies']['tabs'][number] => item !== null);

  return normalized.length > 0 ? normalized : fallback;
}

function hasStructuredSections(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return ['nav', 'hero', 'brandAcronym', 'about', 'features', 'caseStudies', 'services', 'mission', 'insights', 'faq', 'cta', 'footer']
    .every((key) => isRecord(value[key]));
}

export function resolveHomepageContent(global: unknown): HomepageContent {
  if (!isRecord(global)) {
    return homepageContent;
  }

  // Source of truth is the structured global sections. Legacy JSON `content`
  // fallback is intentionally ignored to keep behavior deterministic.
  if (!hasStructuredSections(global)) {
    return homepageContent;
  }

  const data = global;
  const defaults = homepageContent;

  const nav = data.nav as Record<string, unknown>;
  const hero = data.hero as Record<string, unknown>;
  const brandAcronym = data.brandAcronym as Record<string, unknown>;
  const about = data.about as Record<string, unknown>;
  const features = data.features as Record<string, unknown>;
  const caseStudies = data.caseStudies as Record<string, unknown>;
  const services = data.services as Record<string, unknown>;
  const mission = data.mission as Record<string, unknown>;
  const insights = data.insights as Record<string, unknown>;
  const faq = data.faq as Record<string, unknown>;
  const cta = data.cta as Record<string, unknown>;
  const footer = data.footer as Record<string, unknown>;

  return {
    nav: {
      logo: asString(nav.logo, defaults.nav.logo),
      links: asArray(nav.links, defaults.nav.links),
      cta: asString(nav.cta, defaults.nav.cta),
      ctaHref: asLinkValue(nav.ctaHref),
    },
    hero: {
      id: asString(hero.id, defaults.hero.id),
      chip: asString(hero.chip, defaults.hero.chip),
      headingLines: asArray(hero.headingLines, defaults.hero.headingLines),
      description: asString(hero.description, defaults.hero.description),
      primaryCta: asString(hero.primaryCta, defaults.hero.primaryCta),
      primaryCtaHref: asLinkValue(hero.primaryCtaHref),
      secondaryCta: asString(hero.secondaryCta, defaults.hero.secondaryCta),
      secondaryCtaHref: asLinkValue(hero.secondaryCtaHref),
      stats: asArray(hero.stats, defaults.hero.stats),
      image: asMediaURL(hero.imageMedia) ?? asString(hero.image, defaults.hero.image),
      imageAlt: asString(hero.imageAlt, defaults.hero.imageAlt),
      badgeValue: asString(hero.badgeValue, defaults.hero.badgeValue),
      badgeLabel: asString(hero.badgeLabel, defaults.hero.badgeLabel),
      marquee: asStringList(hero.marquee, defaults.hero.marquee),
    },
    brandAcronym: {
      id: asString(brandAcronym.id, defaults.brandAcronym.id),
      chip: asString(brandAcronym.chip, defaults.brandAcronym.chip),
      title: asString(brandAcronym.title, defaults.brandAcronym.title),
      subtitle: asString(brandAcronym.subtitle, defaults.brandAcronym.subtitle),
      items: asArray(brandAcronym.items, defaults.brandAcronym.items),
    },
    about: {
      id: asString(about.id, defaults.about.id),
      chip: asString(about.chip, defaults.about.chip),
      headingLines: asArray(about.headingLines, defaults.about.headingLines),
      paragraphs: asStringList(about.paragraphs, defaults.about.paragraphs),
      cta: asString(about.cta, defaults.about.cta),
      ctaHref: asLinkValue(about.ctaHref),
      image: asMediaURL(about.imageMedia) ?? asString(about.image, defaults.about.image),
      imageAlt: asString(about.imageAlt, defaults.about.imageAlt),
    },
    features: {
      cards: asArray(features.cards, defaults.features.cards).map((card, index) => {
        const fallback = defaults.features.cards[index] ?? defaults.features.cards[0];
        if (!isRecord(card)) {
          return fallback;
        }
        const cardRec = card as Record<string, unknown>;
        return {
          category: asString(cardRec.category, fallback.category),
          title: asString(cardRec.title, fallback.title),
          description: asString(cardRec.description, fallback.description),
          image: asMediaURL(cardRec.imageMedia) ?? asString(cardRec.image, fallback.image),
          alt: asString(cardRec.alt, fallback.alt),
        };
      }),
    },
    caseStudies: {
      id: asString(caseStudies.id, defaults.caseStudies.id),
      chip: asString(caseStudies.chip, defaults.caseStudies.chip),
      title: asString(caseStudies.title, defaults.caseStudies.title),
      cta: asString(caseStudies.cta, defaults.caseStudies.cta),
      ctaHref: asLinkValue(caseStudies.ctaHref),
      tabs: normalizeCaseTabs(caseStudies.tabs, defaults.caseStudies.tabs),
      main: normalizeCaseStudiesMain(caseStudies.main, defaults.caseStudies.main),
      minis: asArray(caseStudies.minis, defaults.caseStudies.minis).map((mini, index) => {
        const fallback = defaults.caseStudies.minis[index] ?? defaults.caseStudies.minis[0];
        if (!isRecord(mini)) {
          return fallback;
        }
        const miniRec = mini as Record<string, unknown>;
        return {
          tag: asString(miniRec.tag, fallback.tag),
          title: asString(miniRec.title, fallback.title),
          stat: asString(miniRec.stat, fallback.stat),
          statLabel: asString(miniRec.statLabel, fallback.statLabel),
          image: asMediaURL(miniRec.imageMedia) ?? asString(miniRec.image, fallback.image),
          alt: asString(miniRec.alt, fallback.alt),
        };
      }),
    },
    services: {
      id: asString(services.id, defaults.services.id),
      chip: asString(services.chip, defaults.services.chip),
      titleLines: asStringList(services.titleLines, defaults.services.titleLines),
      description: asString(services.description, defaults.services.description),
      items: asArray(services.items, defaults.services.items).map((item, index) => {
        const fallback = defaults.services.items[index] ?? defaults.services.items[0];
        if (!isRecord(item)) {
          return fallback;
        }
        const itemRec = item as Record<string, unknown>;
        return {
          number: asString(itemRec.number, fallback.number),
          name: asString(itemRec.name, fallback.name),
          description: asString(itemRec.description, fallback.description),
          image: asMediaURL(itemRec.imageMedia) ?? asString(itemRec.image, fallback.image),
          alt: asString(itemRec.alt, fallback.alt),
        };
      }),
    },
    mission: {
      chip: asString(mission.chip, defaults.mission.chip),
      title: asString(mission.title, defaults.mission.title),
      description: asString(mission.description, defaults.mission.description),
      checks: asStringList(mission.checks, defaults.mission.checks),
      cta: asString(mission.cta, defaults.mission.cta),
      ctaHref: asLinkValue(mission.ctaHref),
      image: asMediaURL(mission.imageMedia) ?? asString(mission.image, defaults.mission.image),
      imageAlt: asString(mission.imageAlt, defaults.mission.imageAlt),
    },
    insights: {
      id: asString(insights.id, defaults.insights.id),
      chip: asString(insights.chip, defaults.insights.chip),
      title: asString(insights.title, defaults.insights.title),
      cta: asString(insights.cta, defaults.insights.cta),
      ctaHref: asLinkValue(insights.ctaHref),
      items: asArray(insights.items, defaults.insights.items).map((item, index) => {
        const fallback = defaults.insights.items[index] ?? defaults.insights.items[0];
        if (!isRecord(item)) {
          return fallback;
        }
        const itemRec = item as Record<string, unknown>;
        return {
          date: asString(itemRec.date, fallback.date),
          title: asString(itemRec.title, fallback.title),
          image: asMediaURL(itemRec.imageMedia) ?? asString(itemRec.image, fallback.image),
          alt: asString(itemRec.alt, fallback.alt),
        };
      }),
    },
    faq: {
      id: asString(faq.id, defaults.faq.id),
      chip: asString(faq.chip, defaults.faq.chip),
      title: asString(faq.title, defaults.faq.title),
      intro: asString(faq.intro, defaults.faq.intro),
      cta: asString(faq.cta, defaults.faq.cta),
      ctaHref: asLinkValue(faq.ctaHref),
      items: asArray(faq.items, defaults.faq.items),
    },
    cta: {
      chip: asString(cta.chip, defaults.cta.chip),
      headingLines: asArray(cta.headingLines, defaults.cta.headingLines),
      subtitle: asString(cta.subtitle, defaults.cta.subtitle),
      inputPlaceholder: asString(cta.inputPlaceholder, defaults.cta.inputPlaceholder),
      button: asString(cta.button, defaults.cta.button),
      note: asString(cta.note, defaults.cta.note),
    },
    footer: {
      logo: asString(footer.logo, defaults.footer.logo),
      tagline: asString(footer.tagline, defaults.footer.tagline),
      socials: asArray(footer.socials, defaults.footer.socials),
      columns: asArray(footer.columns, defaults.footer.columns),
      copyright: asString(footer.copyright, defaults.footer.copyright),
      badges: asArray(footer.badges, defaults.footer.badges),
    },
  };
}
