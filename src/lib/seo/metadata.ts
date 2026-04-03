import type { Metadata } from 'next';
import { absoluteURL, canonicalFromPath } from '@/lib/cms/urls';
import type { SiteSettingsData } from '@/lib/site-settings';

export type SEOInput = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  canonicalURL?: string | null;
  noindex?: boolean | null;
  keywords?: string | null;
};

export function buildMetadata(args: {
  pathname: string;
  seo?: SEOInput;
  settings: SiteSettingsData;
  fallbackTitle: string;
  fallbackDescription?: string;
}): Metadata {
  const { pathname, seo, settings, fallbackTitle, fallbackDescription } = args;

  const title = seo?.title?.trim() || fallbackTitle;
  const description = seo?.description?.trim() || fallbackDescription || settings.siteDescription;
  const ogFallback = `/og?${new URLSearchParams({ title }).toString()}`;
  const image = seo?.image || settings.defaultOgImage || ogFallback;
  const canonical = seo?.canonicalURL?.trim() || canonicalFromPath(pathname);
  const noindex = seo?.noindex === true || settings.robotsPolicy === 'noindex-nofollow';
  const keywords = seo?.keywords?.trim();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      types: {
        'application/rss+xml': absoluteURL('/feed.xml'),
      },
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteURL(pathname),
      siteName: settings.siteName,
      images: image ? [{ url: absoluteURL(image) }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      site: settings.twitterHandle,
      creator: settings.twitterHandle,
      images: image ? [absoluteURL(image)] : undefined,
    },
  };
}
