import { absoluteURL } from '@/lib/cms/urls';
import type { SiteSettingsData } from '@/lib/site-settings';

export function buildOrganizationJsonLd(settings: SiteSettingsData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.organizationName,
    url: settings.defaultCanonicalBase,
    logo: settings.organizationLogo ? absoluteURL(settings.organizationLogo) : undefined,
  };
}

export function buildWebsiteJsonLd(settings: SiteSettingsData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: settings.defaultCanonicalBase,
  };
}

export function buildWebPageJsonLd(args: { title: string; description: string; pathname: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: args.title,
    description: args.description,
    url: absoluteURL(args.pathname),
  };
}

export function buildArticleJsonLd(args: {
  title: string;
  description: string;
  pathname: string;
  publishedAt?: string;
  modifiedAt?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url: absoluteURL(args.pathname),
    datePublished: args.publishedAt,
    dateModified: args.modifiedAt,
    image: args.image ? [absoluteURL(args.image)] : undefined,
  };
}

export function buildFAQJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteURL(item.url),
    })),
  };
}
