import Link from 'next/link';
import type { PageContent, CaseStudySeed } from '../content';

const COLOR_VAR: Record<NonNullable<CaseStudySeed['color']>, string> = {
  primary: 'var(--primary)',
  accent: 'var(--accent)',
  support: 'var(--support)',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function CaseStudiesGrid({ data }: { data: PageContent['caseStudies'] }) {
  const items = data.items ?? [];

  return (
    <section className="cs2-main">
      <div className="cs2-wrap">
        {items.length === 0 && (
          <p className="cs2-empty">No case studies published yet.</p>
        )}
        {items.map((cs, i) => {
          const color = COLOR_VAR[cs.color] ?? COLOR_VAR.primary;
          const card = (
            <div className="cs2-card" key={cs.slug ?? `${cs.client}-${i}`}>
              <div className="cs2-card__header" style={{ borderColor: color }}>
                <div className="cs2-card__meta">
                  <span className="cs2-card__specialty">{cs.specialty}</span>
                  <div className="cs2-card__tags">
                    {cs.tags.map((t) => (
                      <span key={t} className="cs2-badge">{t}</span>
                    ))}
                  </div>
                </div>
                <h2 className="cs2-card__client">
                  {cs.slug ? (
                    <Link href={`/case-studies/${cs.slug}`} className="cs2-card__client-link">
                      {cs.client}
                    </Link>
                  ) : (
                    cs.client
                  )}
                </h2>
              </div>
              <div className="cs2-card__body">
                <div className="cs2-card__col">
                  <div className="cs2-section-label">The Challenge</div>
                  <p>{cs.challenge}</p>
                  <div className="cs2-section-label cs2-section-label--mt">The Strategy</div>
                  <p>{cs.strategy}</p>
                </div>
                <div className="cs2-card__col">
                  <div className="cs2-results">
                    {cs.results.map((r, j) => (
                      <div key={j} className="cs2-result" style={{ borderTopColor: color }}>
                        <div className="cs2-result__n" style={{ color }}>{r.n}</div>
                        <div className="cs2-result__l">{r.l}</div>
                      </div>
                    ))}
                  </div>
                  <figure className="cs2-quote">
                    <blockquote>&ldquo;{cs.quote}&rdquo;</blockquote>
                    <figcaption>
                      <div className="cs2-quote__avatar" style={{ background: color }}>
                        {initials(cs.author)}
                      </div>
                      <div>
                        <b>{cs.author}</b>
                        <span>{cs.role}</span>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          );
          return card;
        })}
      </div>
    </section>
  );
}
