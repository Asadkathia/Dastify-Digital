import { getPayloadClient } from './payload';
import { cache } from 'react';

export type SiteSettingsData = {
  siteName: string;
  siteDescription: string;
  organizationName: string;
  organizationLogo?: string;
  defaultCanonicalBase: string;
  defaultOgImage?: string;
  robotsPolicy: 'index-follow' | 'noindex-nofollow';
  twitterHandle?: string;
  googleAnalyticsId?: string;
};

const FALLBACK: SiteSettingsData = {
  siteName: 'Dastify Digital',
  siteDescription: 'The creative authority for healthcare growth.',
  organizationName: 'Dastify Digital',
  defaultCanonicalBase: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  robotsPolicy: 'index-follow',
};

async function loadSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 });

    return {
      ...FALLBACK,
      siteName: typeof doc.siteName === 'string' && doc.siteName ? doc.siteName : FALLBACK.siteName,
      siteDescription:
        typeof doc.siteDescription === 'string' && doc.siteDescription
          ? doc.siteDescription
          : FALLBACK.siteDescription,
      organizationName:
        typeof doc.organizationName === 'string' && doc.organizationName
          ? doc.organizationName
          : FALLBACK.organizationName,
      organizationLogo:
        doc.organizationLogo && typeof doc.organizationLogo === 'object' && 'url' in doc.organizationLogo
          ? String(doc.organizationLogo.url || '')
          : undefined,
      defaultCanonicalBase:
        typeof doc.defaultCanonicalBase === 'string' && doc.defaultCanonicalBase
          ? doc.defaultCanonicalBase
          : FALLBACK.defaultCanonicalBase,
      defaultOgImage:
        doc.defaultOgImage && typeof doc.defaultOgImage === 'object' && 'url' in doc.defaultOgImage
          ? String(doc.defaultOgImage.url || '')
          : undefined,
      robotsPolicy:
        doc.robotsPolicy === 'noindex-nofollow' || doc.robotsPolicy === 'index-follow'
          ? doc.robotsPolicy
          : FALLBACK.robotsPolicy,
      twitterHandle: typeof doc.twitterHandle === 'string' ? doc.twitterHandle : undefined,
      googleAnalyticsId:
        typeof doc.googleAnalyticsId === 'string' && doc.googleAnalyticsId ? doc.googleAnalyticsId : undefined,
    };
  } catch {
    return FALLBACK;
  }
}

export const getSiteSettings = cache(loadSiteSettings);
