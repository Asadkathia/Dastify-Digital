'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostSeed, PageContent } from '../content';

type MainProps = {
  data: PageContent['main'];
  /** Posts coming from Payload (when present, overrides static seed). */
  posts?: BlogPostSeed[];
};

function PostImage({ post }: { post: BlogPostSeed }) {
  if (post.image) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={post.image} alt={post.imageAlt ?? post.title} className="bl2-card__img-real" />;
  }
  // TODO(assets): provide /public/blog/<slug>.webp; falling back to placeholder
  return (
    <div className="iph bl2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
      <span>{post.cat}</span>
    </div>
  );
}

export default function Main({ data, posts }: MainProps) {
  const allPosts = posts && posts.length > 0 ? posts : data.posts;
  const featured = allPosts.find((p) => p.featured) ?? allPosts[0];
  const rest = featured ? allPosts.filter((p) => p !== featured) : allPosts;

  const [activeCat, setActiveCat] = useState<string>('All');
  const filtered = useMemo(
    () => (activeCat === 'All' ? rest : rest.filter((p) => p.cat === activeCat)),
    [activeCat, rest],
  );

  return (
    <section className="bl2-main">
      <div className="bl2-wrap">
        {featured ? (
          <Link href={featured.href} className="bl2-featured">
            <div className="bl2-featured__media">
              {featured.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={featured.image} alt={featured.imageAlt ?? featured.title} className="bl2-featured__img-real" />
              ) : (
                // TODO(assets): provide /public/blog/<slug>.webp for the featured post; placeholder used.
                <div className="iph bl2-featured__iph" role="img" aria-label="Featured post placeholder">
                  <span>{featured.cat}</span>
                </div>
              )}
            </div>
            <div className="bl2-featured__body">
              <span className="bl2-badge bl2-badge--primary">{featured.cat}</span>
              <h2 className="bl2-featured__title">{featured.title}</h2>
              <p className="bl2-featured__excerpt">{featured.excerpt}</p>
              <div className="bl2-featured__meta">{featured.date} · {featured.read}</div>
            </div>
          </Link>
        ) : null}

        <div className="bl2-cats" role="tablist" aria-label="Filter posts by category">
          {data.categories.map((c) => {
            const isActive = activeCat === c;
            return (
              <button
                type="button"
                key={c}
                role="tab"
                aria-selected={isActive}
                className={'bl2-cat' + (isActive ? ' is-active' : '')}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="bl2-grid">
          {filtered.length === 0 ? (
            <p className="bl2-grid__empty">No posts in this category yet.</p>
          ) : (
            filtered.map((p) => (
              <Link href={p.href} key={p.id} className="bl2-card">
                <div className="bl2-card__media">
                  <PostImage post={p} />
                </div>
                <div className="bl2-card__body">
                  <span className="bl2-badge bl2-badge--primary">{p.cat}</span>
                  <h3 className="bl2-card__title">{p.title}</h3>
                  <p className="bl2-card__excerpt">{p.excerpt}</p>
                  <div className="bl2-card__meta">{p.date} · {p.read}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
