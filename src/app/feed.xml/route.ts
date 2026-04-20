import { NextResponse } from 'next/server';
import { findManyPublishedSlim } from '@/lib/cms/queries';
import { generateRSS } from '@/lib/seo/rss';
import { getSiteSettings } from '@/lib/site-settings';

export async function GET() {
  const [posts, settings] = await Promise.all([
    findManyPublishedSlim('blog-posts', { title: true, excerpt: true, slug: true, publishedAt: true }, 200),
    getSiteSettings(),
  ]);

  const xml = generateRSS({
    title: `${settings.siteName} Blog`,
    description: settings.siteDescription,
    items: posts.map((post) => ({
      title: String(post.title || 'Untitled'),
      description: String(post.excerpt || ''),
      slug: String(post.slug || ''),
      publishedAt: typeof post.publishedAt === 'string' ? post.publishedAt : undefined,
    })),
  });

  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  });
}
