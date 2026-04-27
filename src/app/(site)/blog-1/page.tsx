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
import { defaultContent, type BlogPostSeed } from './content';

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

function estimateReadTime(excerpt?: string | null): string {
  // Without article body in the list query we keep this stable; marketing can override per-post later.
  if (!excerpt) return '5 min read';
  const words = excerpt.split(/\s+/).length;
  // Treat the excerpt as a fraction (~1/40) of the article — heuristic only.
  const estWords = Math.max(words * 40, 600);
  return `${Math.max(3, Math.round(estWords / 220))} min read`;
}

function docToSeed(doc: BlogPostDoc, index: number): BlogPostSeed {
  const cats = Array.isArray(doc.categories) ? doc.categories : [];
  const firstCat = cats.find((c): c is { title?: string } => typeof c === 'object' && c !== null);
  const category = firstCat && typeof firstCat.title === 'string' ? firstCat.title : 'Insights';
  return {
    id: String(doc.id ?? doc.slug),
    cat: category,
    title: doc.title,
    excerpt: doc.excerpt ?? '',
    date: formatDate(doc.publishedAt),
    read: estimateReadTime(doc.excerpt ?? null),
    href: `/blog/${doc.slug}`,
    image: doc.featuredImage?.url || undefined,
    imageAlt: doc.featuredImage?.alt || doc.title,
    featured: index === 0,
  };
}

async function fetchBlogPosts(): Promise<BlogPostDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      depth: 1,
      limit: 24,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } } as never,
    });
    return (res.docs ?? []) as unknown as BlogPostDoc[];
  } catch (err) {
    console.error('[blog-1 page] fetch failed:', err);
    return [];
  }
}

export default async function BlogIndexPage() {
  const [docs, nav, footer] = await Promise.all([
    fetchBlogPosts(),
    getNavigation(),
    getFooter(),
  ]);

  const posts: BlogPostSeed[] | undefined = docs.length > 0 ? docs.map(docToSeed) : undefined;

  // Derive categories: keep "All" first, then union of seed + Payload categories.
  const liveCats = posts ? Array.from(new Set(posts.map((p) => p.cat).filter(Boolean))) : [];
  const seedCats = defaultContent.main.categories.slice(1);
  const categories = ['All', ...Array.from(new Set([...seedCats, ...liveCats]))];

  const content: Record<string, unknown> = {
    ...defaultContent,
    main: {
      ...defaultContent.main,
      categories,
      // When Payload has docs, expose them via posts; otherwise keep seed defaults.
      posts: posts ?? defaultContent.main.posts,
    },
  };

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/blog-1" /> : null}
      <main>
        {registry.sections.map((section) => {
          const Component = section.Component as ComponentType<{ data: unknown }>;
          return <Component key={section.key} data={content[section.key]} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog-1' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/blog-1',
        })}
      />
    </>
  );
}
