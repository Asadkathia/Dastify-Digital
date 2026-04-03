import type { MetadataRoute } from 'next';
import { absoluteURL } from '@/lib/cms/urls';
import { getSiteSettings } from '@/lib/site-settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const blocked = settings.robotsPolicy === 'noindex-nofollow';

  return {
    rules: {
      userAgent: '*',
      allow: blocked ? [] : '/',
      disallow: blocked ? '/' : ['/admin', '/api'],
    },
    sitemap: absoluteURL('/sitemap.xml'),
  };
}
