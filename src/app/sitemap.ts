import type { MetadataRoute } from 'next';
import { absoluteURL } from '@/lib/cms/urls';
import { findManyPublishedSlim } from '@/lib/cms/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slimFields = { slug: true, updatedAt: true } as const;
  const [pages, services, caseStudies, blogPosts] = await Promise.all([
    findManyPublishedSlim('pages', slimFields, 500),
    findManyPublishedSlim('services', slimFields, 500),
    findManyPublishedSlim('case-studies', slimFields, 500),
    findManyPublishedSlim('blog-posts', slimFields, 500),
  ]);

  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: absoluteURL('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  };

  // Slugs that resolve to a different canonical URL (e.g. 'home' → '/') or
  // are retired entirely (handled via next.config.ts redirects). Keep them
  // out of the sitemap so search engines don't index duplicates or 308s.
  const EXCLUDED_PAGE_SLUGS = new Set([
    'home',
    'demo',
    'contact-2',
    'case-studies-converted',
  ]);

  const mapDocs = (
    docs: Array<Record<string, unknown>>,
    prefix: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    excludeSlugs?: Set<string>,
  ): MetadataRoute.Sitemap => {
    return docs
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.length > 0)
      .filter((doc) => !excludeSlugs?.has(String(doc.slug)))
      .map((doc) => ({
        url: absoluteURL(`${prefix}/${String(doc.slug)}`.replace(/\/+/g, '/')),
        lastModified: typeof doc.updatedAt === 'string' ? new Date(doc.updatedAt) : new Date(),
        changeFrequency,
        priority,
      }));
  };

  return [
    rootEntry,
    ...mapDocs(pages, '', 0.8, 'monthly', EXCLUDED_PAGE_SLUGS),
    ...mapDocs(services, '/services', 0.8, 'monthly'),
    ...mapDocs(caseStudies, '/case-studies', 0.7, 'monthly'),
    ...mapDocs(blogPosts, '/blog', 0.7, 'weekly'),
  ];
}
