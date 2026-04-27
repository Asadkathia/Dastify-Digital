import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';

export default function BlogPreview({ data }: { data: HomepageContent['blogPreview'] }) {
  return (
    <section className="hp2-blog">
      <div className="hp2-wrap">
        <div className="hp2-section-head">
          <div className="hp2-eyebrow">{data.eyebrow}</div>
          <h2 className="hp2-h2">{data.title}</h2>
          <p className="hp2-intro">{data.intro}</p>
        </div>
        <div className="hp2-blog__grid">
          {data.posts.map((p, i) => (
            <article key={i} className="hp2-post">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.imageAlt ?? p.title}
                  className="hp2-post__img"
                />
              ) : (
                <div className="hp2-post__img iph" aria-hidden="true">
                  <span>{p.tag.toLowerCase()} visual</span>
                </div>
              )}
              <div className="hp2-post__body">
                <span className="hp2-post__badge">{p.tag}</span>
                <h3 className="hp2-post__title">
                  {p.href ? <Link href={p.href}>{p.title}</Link> : p.title}
                </h3>
                <span className="hp2-post__meta">{p.readTime}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="hp2-blog__cta">
          <Link href={data.ctaHref} className="hp2-btn hp2-btn--secondary hp2-btn--md">
            <span>{data.ctaLabel}</span>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
