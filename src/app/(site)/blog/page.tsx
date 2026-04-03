import type { Metadata } from 'next';
import Link from 'next/link';
import { findBlogPage } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/blog',
    settings,
    fallbackTitle: 'Blog',
    fallbackDescription: 'Latest insights and updates.',
  });
}

export default async function BlogIndexPage() {
  const { docs, totalPages } = await findBlogPage(1, false);

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Blog</h1>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {docs.map((doc) => (
            <article key={String(doc.id)}>
              <h2 style={{ fontSize: '24px' }}>
                <Link href={`/blog/${String(doc.slug || '')}`}>{String(doc.title || 'Untitled')}</Link>
              </h2>
              {doc.excerpt ? <p>{String(doc.excerpt)}</p> : null}
            </article>
          ))}
        </div>
        {totalPages > 1 ? (
          <div style={{ marginTop: '24px' }}>
            <Link href="/blog/page/2">Next page →</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
