import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';

export default function AboutPreview({ data }: { data: HomepageContent['aboutPreview'] }) {
  return (
    <div className="hp2-section-tinted">
    <section className="hp2-about">
      <div className="hp2-wrap">
        <div className="hp2-about__layout">
          <div className="hp2-about__text">
            <div className="hp2-eyebrow">{data.eyebrow}</div>
            <h2 className="hp2-h2">
              {data.titleLead}
              <br />
              {data.titleTail}
            </h2>
            <p className="hp2-intro">{data.body}</p>
            <div className="hp2-about__stats">
              {data.stats.map((s, i) => (
                <div key={i}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="hp2-about__cta-wrap">
              <Link href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--md">
                <Icon name="arrow" size={16} />
                <span>{data.ctaLabel}</span>
              </Link>
            </div>
          </div>
          <div className="hp2-about__visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.imageAlt} className="hp2-about__img" />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
