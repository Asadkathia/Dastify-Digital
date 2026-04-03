import type { MetadataRoute } from 'next';
import { absoluteURL } from '@/lib/cms/urls';
import { findManyPublished } from '@/lib/cms/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, caseStudies, blogPosts] = await Promise.all([
    findManyPublished('pages', 500),
    findManyPublished('services', 500),
    findManyPublished('case-studies', 500),
    findManyPublished('blog-posts', 500),
  ]);

  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: absoluteURL('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  };

  const mapDocs = (
    docs: Array<Record<string, unknown>>,
    prefix: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  ): MetadataRoute.Sitemap => {
    return docs
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.length > 0)
      .map((doc) => ({
        url: absoluteURL(`${prefix}/${String(doc.slug)}`.replace(/\/+/g, '/')),
        lastModified: typeof doc.updatedAt === 'string' ? new Date(doc.updatedAt) : new Date(),
        changeFrequency,
        priority,
      }));
  };

  return [
    rootEntry,
    ...mapDocs(pages, '', 0.8, 'monthly'),
    ...mapDocs(services, '/services', 0.8, 'monthly'),
    ...mapDocs(caseStudies, '/case-studies', 0.7, 'monthly'),
    ...mapDocs(blogPosts, '/blog', 0.7, 'weekly'),
  ];
}
