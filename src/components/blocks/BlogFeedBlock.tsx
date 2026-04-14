'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type BlogFeedBlockProps = {
  type: 'blog_feed';
  title?: string;
  subtitle?: string;
  source?: 'latest' | 'category' | 'tag';
  category?: string;
  tag?: string;
  limit?: number;
  layout?: 'grid' | 'list' | 'featured';
  columns?: '2' | '3';
  showExcerpt?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

type Post = { id: string; title: string; slug: string; excerpt?: string; publishedAt?: string; category?: { title: string; slug: string }; heroImage?: { url: string } };

export function BlogFeedBlock({ title, subtitle, source = 'latest', category, tag, limit = 3, layout = 'grid', columns = '3', showExcerpt = true, showDate = true, showCategory = true, ctaLabel, ctaHref }: BlogFeedBlockProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit), depth: '1' });
    if (source === 'category' && category) params.set('where[categories.slug][equals]', category);
    if (source === 'tag' && tag) params.set('where[tags.slug][equals]', tag);
    params.set('sort', '-publishedAt');

    fetch(`/api/blog-posts?${params}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { docs: [] })
      .then((data) => setPosts((data.docs ?? []) as Post[]))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [source, category, tag, limit]);

  const cols = Number(columns) || 3;

  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            {title && <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{title}</h2>}
            {subtitle && <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>{subtitle}</p>}
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading posts…</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No posts found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: layout === 'list' ? '1fr' : `repeat(${cols}, 1fr)`, gap: '32px' }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.2s', background: '#fff' }}>
                  {post.heroImage?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.heroImage.url} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '20px' }}>
                    {showCategory && post.category && (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.category.title}</span>
                    )}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '8px 0' }}>{post.title}</h3>
                    {showExcerpt && post.excerpt && <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.6 }}>{post.excerpt}</p>}
                    {showDate && post.publishedAt && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
        {ctaLabel && ctaHref && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href={ctaHref} style={{ display: 'inline-block', padding: '12px 32px', background: '#0ea5e9', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '16px', textDecoration: 'none' }}>
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
