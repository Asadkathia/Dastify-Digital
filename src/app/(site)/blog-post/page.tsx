import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { getNavigation, getFooter } from '@/lib/cms/queries';
import { getPayloadClient } from '@/lib/payload';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import registry from './editor-registry';
import { defaultContent, type PageContent } from './content';
import type { BlogPostSeed } from '../blog-1/content';

type BlogPostDoc = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  featuredImage?: { url?: string; alt?: string } | null;
  categories?: Array<{ title?: string } | string | number> | null;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

function formatDate(input?: string | null): string {
  if (!input) return '';
  try {
    return new Date(input).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

async function fetchRelatedPosts(): Promise<BlogPostSeed[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } } as never,
    });
    const docs = (res.docs ?? []) as unknown as BlogPostDoc[];
    return docs.map((doc) => {
      const cats = Array.isArray(doc.categories) ? doc.categories : [];
      const firstCat = cats.find((c): c is { title?: string } => typeof c === 'object' && c !== null);
      return {
        id: String(doc.id ?? doc.slug),
        cat: firstCat?.title ?? 'Insights',
        title: doc.title,
        excerpt: doc.excerpt ?? '',
        date: formatDate(doc.publishedAt),
        read: '',
        href: `/blog/${doc.slug}`,
        image: doc.featuredImage?.url || undefined,
        imageAlt: doc.featuredImage?.alt || doc.title,
      };
    });
  } catch (err) {
    console.error('[blog-post page] related fetch failed:', err);
    return [];
  }
}

export default async function BlogPostPage() {
  const [related, nav, footer] = await Promise.all([
    fetchRelatedPosts(),
    getNavigation(),
    getFooter(),
  ]);

  const content: PageContent = {
    ...defaultContent,
    related: {
      ...defaultContent.related,
      posts: related.length > 0 ? related : defaultContent.related.posts,
    },
  };
  const contentMap = content as unknown as Record<string, unknown>;

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/blog-1" /> : null}
      <main>
        {registry.sections.map((section) => {
          const Component = section.Component as ComponentType<{ data: unknown }>;
          return <Component key={section.key} data={contentMap[section.key]} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog-1' },
          { name: defaultContent.hero.title, url: '/blog-post' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/blog-post',
        })}
      />
    </>
  );
}
