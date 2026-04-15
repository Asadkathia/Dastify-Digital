import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { CmsImage } from '@/components/CmsImage';

type InsightsProps = {
  data: HomepageContent['insights'];
};

export function Insights({ data }: InsightsProps) {
  const [titleTop, titleBottom] = data.title.split('\n');
  const ctaHref = data.ctaHref?.url || '/blog';

  return (
    <section className="insights sp" id={data.id}>
      <span className="sec-wm g1">I</span>
      <div className="wrap">
        <div className="insights-head">
          <div>
            <div data-r>
              <span className="chip" style={{ marginBottom: '12px' }}>
                <span className="chip-dot" />
                {data.chip}
              </span>
            </div>
            <h2 className="insights-h2" data-r data-delay="1">
              {titleTop}
              <br />
              {titleBottom}
            </h2>
          </div>
          <Link
            className="btn-ol"
            data-r
            href={ctaHref}
            target={data.ctaHref?.openInNewTab ? '_blank' : undefined}
            rel={data.ctaHref?.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            <span data-field="cta">{data.cta}</span>
          </Link>
        </div>

        <div className="blog-grid">
          {data.items.map((item, index) => (
            <div key={item.title} className="blog-card" data-r data-delay={((index % 3) + 1).toString()}>
              <div className="blog-img img-reveal">
                <CmsImage src={item.image} alt={item.alt} objectFit="cover" />
              </div>
              <div className="blog-info">
                <div className="blog-date">{item.date}</div>
                <div className="blog-title">{item.title}</div>
                <Link className="blog-link" href="/blog">
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
