import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';
import AnimCounter from './_AnimCounter';

export default function Results({ data }: { data: HomepageContent['results'] }) {
  return (
    <section className="hp2-results">
      <div className="hp2-wrap">
        <div className="hp2-section-head is-light">
          <div className="hp2-eyebrow is-light">{data.eyebrow}</div>
          <h2 className="hp2-h2 is-light">
            {data.titleLead}
            <br />
            {data.titleTail}
          </h2>
          <p className="hp2-intro is-light">{data.intro}</p>
        </div>
        <div className="hp2-results__grid">
          {data.cards.map((c, i) => (
            <div key={i} className={`hp2-result-card${c.featured ? ' hp2-result-card--feature' : ''}`}>
              <div className="hp2-result-card__client">{c.client}</div>
              <AnimCounter value={c.value} label={c.label} color="#fff" />
              <div className="hp2-result-card__bar">
                <i style={{ width: `${c.barPercent}%` }} />
              </div>
              {c.subStats ? (
                <div className="hp2-result-card__detail">
                  {c.subStats.map((s, j) => (
                    <AnimCounter key={j} value={s.value} label={s.label} color="#fff" />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="hp2-results__cta">
          <Link href={data.ctaHref} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
            <span>{data.ctaLabel}</span>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
