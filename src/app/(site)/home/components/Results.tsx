import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';
import AnimCounter from './_AnimCounter';

export default function Results({ data }: { data: HomepageContent['results'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleTail = getConvertedNodeBinding(data, { field: 'titleTail', defaultTag: 'span' });
  const TitleTailTag = titleTail.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;
  return (
    <section className="hp2-results">
      <div className="hp2-wrap">
        <div className="hp2-section-head is-light">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow is-light">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2 is-light">
            {data.titleLead}
            <br />
            <TitleTailTag {...titleTail.props}>{data.titleTail}</TitleTailTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro is-light">{data.intro}</IntroTag>
        </div>
        <div className="hp2-results__grid">
          {data.cards.map((c, i) => {
            const clientB = getConvertedNodeBinding(data, { field: `cards.${i}.client`, defaultTag: 'div' });
            const CTag = clientB.Tag;
            const valueB = getConvertedNodeBinding(data, { field: `cards.${i}.value`, defaultTag: 'span' });
            const labelB = getConvertedNodeBinding(data, { field: `cards.${i}.label`, defaultTag: 'span' });
            return (
              <div key={i} className={`hp2-result-card${c.featured ? ' hp2-result-card--feature' : ''}`}>
                <CTag {...clientB.props} className="hp2-result-card__client">{c.client}</CTag>
                <AnimCounter value={c.value} label={c.label} color="#fff" valueProps={valueB.props} labelProps={labelB.props} />
                <div className="hp2-result-card__bar">
                  <i style={{ width: `${c.barPercent}%` }} />
                </div>
                {c.subStats ? (
                  <div className="hp2-result-card__detail">
                    {c.subStats.map((s, j) => {
                      const sV = getConvertedNodeBinding(data, { field: `cards.${i}.subStats.${j}.value`, defaultTag: 'span' });
                      const sL = getConvertedNodeBinding(data, { field: `cards.${i}.subStats.${j}.label`, defaultTag: 'span' });
                      return (
                        <AnimCounter key={j} value={s.value} label={s.label} color="#fff" valueProps={sV.props} labelProps={sL.props} />
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="hp2-results__cta">
          <Link href={data.ctaHref} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
            <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
