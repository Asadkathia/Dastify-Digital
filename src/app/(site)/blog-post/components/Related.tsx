import Link from 'next/link';
import type { BlogPostSeed } from '../../blog-1/content';
import type { PageContent } from '../content';

function PostMedia({ post }: { post: BlogPostSeed }) {
  if (post.image) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={post.image} alt={post.imageAlt ?? post.title} className="bp2-card__img-real" />;
  }
  // TODO(assets): provide /public/blog/<slug>.webp; placeholder used for related card.
  return (
    <div className="iph bp2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
      <span>{post.cat}</span>
    </div>
  );
}

export default function Related({ data }: { data: PageContent['related'] }) {
  if (!data.posts || data.posts.length === 0) return null;
  return (
    <section className="bp2-related">
      <div className="bp2-wrap">
        <h3 className="bp2-related__title">{data.title}</h3>
        <div className="bp2-related__grid">
          {data.posts.map((p) => (
            <Link href={p.href} key={p.id} className="bp2-card">
              <div className="bp2-card__media">
                <PostMedia post={p} />
              </div>
              <div className="bp2-card__body">
                <span className="bp2-badge bp2-badge--primary">{p.cat}</span>
                <h3 className="bp2-card__title">{p.title}</h3>
                <div className="bp2-card__meta">{p.date} · {p.read}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
