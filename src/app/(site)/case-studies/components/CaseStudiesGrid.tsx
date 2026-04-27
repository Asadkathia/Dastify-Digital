import Link from 'next/link';
import type { PageContent, CaseStudySeed } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';

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
          const specB = getConvertedNodeBinding(data, { field: `items.${i}.specialty`, defaultTag: 'span' });
          const SpecTag = specB.Tag;
          const clientB = getConvertedNodeBinding(data, { field: `items.${i}.client`, defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
          const ClientTag = clientB.Tag;
          const challengeB = getConvertedNodeBinding(data, { field: `items.${i}.challenge`, defaultTag: 'p' });
          const ChTag = challengeB.Tag;
          const strategyB = getConvertedNodeBinding(data, { field: `items.${i}.strategy`, defaultTag: 'p' });
          const StTag = strategyB.Tag;
          const quoteB = getConvertedNodeBinding(data, { field: `items.${i}.quote`, defaultTag: 'blockquote' });
          const QTag = quoteB.Tag;
          const authorB = getConvertedNodeBinding(data, { field: `items.${i}.author`, defaultTag: 'b' });
          const ATag = authorB.Tag;
          const roleB = getConvertedNodeBinding(data, { field: `items.${i}.role`, defaultTag: 'span' });
          const RTag = roleB.Tag;
          const card = (
            <div className="cs2-card" key={cs.slug ?? `${cs.client}-${i}`}>
              <div className="cs2-card__header" style={{ borderColor: color }}>
                <div className="cs2-card__meta">
                  <SpecTag {...specB.props} className="cs2-card__specialty">{cs.specialty}</SpecTag>
                  <div className="cs2-card__tags">
                    {cs.tags.map((t, j) => {
                      const tB = getConvertedNodeBinding(data, { field: `items.${i}.tags.${j}`, defaultTag: 'span' });
                      const TTag = tB.Tag;
                      return <TTag key={`${t}-${j}`} {...tB.props} className="cs2-badge">{t}</TTag>;
                    })}
                  </div>
                </div>
                <ClientTag {...clientB.props} className="cs2-card__client">
                  {cs.slug ? (
                    <Link href={`/case-studies/${cs.slug}`} className="cs2-card__client-link">
                      {cs.client}
                    </Link>
                  ) : (
                    cs.client
                  )}
                </ClientTag>
              </div>
              <div className="cs2-card__body">
                <div className="cs2-card__col">
                  <div className="cs2-section-label">The Challenge</div>
                  <ChTag {...challengeB.props}>{cs.challenge}</ChTag>
                  <div className="cs2-section-label cs2-section-label--mt">The Strategy</div>
                  <StTag {...strategyB.props}>{cs.strategy}</StTag>
                </div>
                <div className="cs2-card__col">
                  <div className="cs2-results">
                    {cs.results.map((r, j) => {
                      const rnB = getConvertedNodeBinding(data, { field: `items.${i}.results.${j}.n`, defaultTag: 'div' });
                      const RnTag = rnB.Tag;
                      const rlB = getConvertedNodeBinding(data, { field: `items.${i}.results.${j}.l`, defaultTag: 'div' });
                      const RlTag = rlB.Tag;
                      return (
                        <div key={j} className="cs2-result" style={{ borderTopColor: color }}>
                          <RnTag {...rnB.props} className="cs2-result__n" style={{ color, ...((rnB.props.style as React.CSSProperties) ?? {}) }}>{r.n}</RnTag>
                          <RlTag {...rlB.props} className="cs2-result__l">{r.l}</RlTag>
                        </div>
                      );
                    })}
                  </div>
                  <figure className="cs2-quote">
                    <QTag {...quoteB.props}>&ldquo;{cs.quote}&rdquo;</QTag>
                    <figcaption>
                      <div className="cs2-quote__avatar" style={{ background: color }}>
                        {initials(cs.author)}
                      </div>
                      <div>
                        <ATag {...authorB.props}>{cs.author}</ATag>
                        <RTag {...roleB.props}>{cs.role}</RTag>
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
