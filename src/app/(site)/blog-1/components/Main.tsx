'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostSeed, PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';

type MainProps = {
  data: PageContent['main'];
  /** Posts coming from Payload (when present, overrides static seed). */
  posts?: BlogPostSeed[];
};

function PostImage({
  post,
  data,
  index,
}: {
  post: BlogPostSeed;
  data: PageContent['main'];
  index: number;
}) {
  // When the post is a static seed, expose it as an editable image slot.
  // For collection-backed posts (index < 0) we fall back to the legacy
  // non-editable render — collection edits happen in the BlogPosts admin.
  if (index < 0) {
    if (post.image) {
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={post.image} alt={post.imageAlt ?? post.title} className="bl2-card__img-real" />;
    }
    return (
      <div className="iph bl2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
        <span>{post.cat}</span>
      </div>
    );
  }
  const imgBinding = getConvertedImageBinding(data, {
    field: `posts.${index}.image`,
    altField: `posts.${index}.imageAlt`,
    defaultAlt: post.imageAlt ?? post.title,
  });
  if (imgBinding.hidden) {
    return (
      <div {...imgBinding.props} data-image-hidden="true" className="iph bl2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
        <span>{post.cat}</span>
      </div>
    );
  }
  if (imgBinding.hasImage) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img {...imgBinding.props} src={imgBinding.src} alt={imgBinding.alt || post.title} className="bl2-card__img-real" />;
  }
  return (
    <div {...imgBinding.props} className="iph bl2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
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

  // When using collection-backed posts, fields like `data.posts.${i}.title` are not the source of truth —
  // the editor cannot edit posts from the collection here. Bind categories + static-only props on `data`.
  const isStatic = !(posts && posts.length > 0);

  return (
    <section className="bl2-main">
      <div className="bl2-wrap">
        {featured ? (() => {
          const fIdx = isStatic ? data.posts.indexOf(featured) : -1;
          const titleField = fIdx >= 0 ? `posts.${fIdx}.title` : null;
          const titleB = titleField ? getConvertedNodeBinding(data, { field: titleField, defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] }) : null;
          const excerptField = fIdx >= 0 ? `posts.${fIdx}.excerpt` : null;
          const excerptB = excerptField ? getConvertedNodeBinding(data, { field: excerptField, defaultTag: 'p' }) : null;
          const catField = fIdx >= 0 ? `posts.${fIdx}.cat` : null;
          const catB = catField ? getConvertedNodeBinding(data, { field: catField, defaultTag: 'span' }) : null;
          const FTitleTag = titleB?.Tag ?? 'h2';
          const FExcerptTag = excerptB?.Tag ?? 'p';
          const FCatTag = catB?.Tag ?? 'span';
          const featuredImg = fIdx >= 0
            ? getConvertedImageBinding(data, {
                field: `posts.${fIdx}.image`,
                altField: `posts.${fIdx}.imageAlt`,
                defaultAlt: featured.imageAlt ?? featured.title,
              })
            : null;
          return (
            <Link href={featured.href} className="bl2-featured">
              <div className="bl2-featured__media">
                {featuredImg?.hidden ? (
                  <div {...featuredImg.props} data-image-hidden="true" className="iph bl2-featured__iph" role="img" aria-label="Featured post placeholder">
                    <span>{featured.cat}</span>
                  </div>
                ) : featuredImg ? (
                  featuredImg.hasImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img {...featuredImg.props} src={featuredImg.src} alt={featuredImg.alt || featured.title} className="bl2-featured__img-real" />
                  ) : (
                    <div {...featuredImg.props} className="iph bl2-featured__iph" role="img" aria-label="Featured post placeholder">
                      <span>{featured.cat}</span>
                    </div>
                  )
                ) : featured.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={featured.image} alt={featured.imageAlt ?? featured.title} className="bl2-featured__img-real" />
                ) : (
                  <div className="iph bl2-featured__iph" role="img" aria-label="Featured post placeholder">
                    <span>{featured.cat}</span>
                  </div>
                )}
              </div>
              <div className="bl2-featured__body">
                <FCatTag {...(catB?.props ?? {})} className="bl2-badge bl2-badge--primary">{featured.cat}</FCatTag>
                <FTitleTag {...(titleB?.props ?? {})} className="bl2-featured__title">{featured.title}</FTitleTag>
                <FExcerptTag {...(excerptB?.props ?? {})} className="bl2-featured__excerpt">{featured.excerpt}</FExcerptTag>
                <div className="bl2-featured__meta">{featured.date} · {featured.read}</div>
              </div>
            </Link>
          );
        })() : null}

        <div className="bl2-cats" role="tablist" aria-label="Filter posts by category">
          {data.categories.map((c, i) => {
            const isActive = activeCat === c;
            const cB = getConvertedNodeBinding(data, { field: `categories.${i}`, defaultTag: 'span' });
            const CTag = cB.Tag;
            return (
              <button
                type="button"
                key={c}
                role="tab"
                aria-selected={isActive}
                className={'bl2-cat' + (isActive ? ' is-active' : '')}
                onClick={() => setActiveCat(c)}
              >
                <CTag {...cB.props}>{c}</CTag>
              </button>
            );
          })}
        </div>

        <div className="bl2-grid">
          {filtered.length === 0 ? (
            <p className="bl2-grid__empty">No posts in this category yet.</p>
          ) : (
            filtered.map((p) => {
              const pIdx = isStatic ? data.posts.indexOf(p) : -1;
              const titleB = pIdx >= 0 ? getConvertedNodeBinding(data, { field: `posts.${pIdx}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] }) : null;
              const excerptB = pIdx >= 0 ? getConvertedNodeBinding(data, { field: `posts.${pIdx}.excerpt`, defaultTag: 'p' }) : null;
              const catB = pIdx >= 0 ? getConvertedNodeBinding(data, { field: `posts.${pIdx}.cat`, defaultTag: 'span' }) : null;
              const TTag = titleB?.Tag ?? 'h3';
              const ETag = excerptB?.Tag ?? 'p';
              const CTag = catB?.Tag ?? 'span';
              return (
                <Link href={p.href} key={p.id} className="bl2-card">
                  <div className="bl2-card__media">
                    <PostImage post={p} data={data} index={pIdx} />
                  </div>
                  <div className="bl2-card__body">
                    <CTag {...(catB?.props ?? {})} className="bl2-badge bl2-badge--primary">{p.cat}</CTag>
                    <TTag {...(titleB?.props ?? {})} className="bl2-card__title">{p.title}</TTag>
                    <ETag {...(excerptB?.props ?? {})} className="bl2-card__excerpt">{p.excerpt}</ETag>
                    <div className="bl2-card__meta">{p.date} · {p.read}</div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
