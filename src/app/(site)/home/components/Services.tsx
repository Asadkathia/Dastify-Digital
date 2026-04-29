import type { CSSProperties } from 'react';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';
import DragScrollRow from './DragScrollRow';

// One accent per card, rotating every 3 (blue → purple → green → repeat).
// We expose the chosen accent via CSS custom properties on the card root so
// the stylesheet only needs a single rule per state instead of three.
const ACCENTS = [
  { c: 'var(--blue)',   lt: 'var(--blue-lt)',   bd: 'var(--blue-bd)',   onHover: '#fff' },
  { c: 'var(--purple)', lt: 'var(--purple-lt)', bd: 'var(--purple-bd)', onHover: '#fff' },
  // Green is too light for white text — flip the whole card to ink-900 on hover.
  { c: 'var(--green)',  lt: 'var(--green-lt)',  bd: 'var(--green-bd)',  onHover: 'var(--ink-900)' },
] as const;

function accentForIndex(i: number) {
  return ACCENTS[i % ACCENTS.length];
}

export default function Services({ data }: { data: HomepageContent['services'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleEm = getConvertedNodeBinding(data, { field: 'titleEm', defaultTag: 'em' });
  const TitleEmTag = titleEm.Tag;
  const titleTail = getConvertedNodeBinding(data, { field: 'titleTail', defaultTag: 'span' });
  const TitleTailTag = titleTail.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;

  return (
    <section className="hp2-services hp2-disc">
      <div className="hp2-wrap">
        <div className="hp2-section-head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2 hp2-disc__h2">
            {data.titleLead}
            {' '}
            <TitleEmTag {...titleEm.props} className="hp2-disc__em">{data.titleEm}</TitleEmTag>
            <TitleTailTag {...titleTail.props}>{data.titleTail}</TitleTailTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>

        <DragScrollRow className="hp2-disc__row" role="list">
          {data.items.map((s, i) => {
            const accent = accentForIndex(i);
            const name = getConvertedNodeBinding(data, { field: `items.${i}.name`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const NameTag = name.Tag;
            const desc = getConvertedNodeBinding(data, { field: `items.${i}.description`, defaultTag: 'p' });
            const DescTag = desc.Tag;
            const ctaLabel = getConvertedNodeBinding(data, { field: `items.${i}.cta.label`, defaultTag: 'span' });
            const CtaLabelTag = ctaLabel.Tag;

            const cardStyle: CSSProperties = {
              ['--card-c' as string]: accent.c,
              ['--card-c-lt' as string]: accent.lt,
              ['--card-c-bd' as string]: accent.bd,
              ['--card-c-on' as string]: accent.onHover,
            };

            return (
              <article
                key={i}
                className="hp2-disc__card"
                role="listitem"
                tabIndex={0}
                style={cardStyle}
              >
                <div className="hp2-disc__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <NameTag {...name.props} className="hp2-disc__title">{s.name}</NameTag>
                <DescTag {...desc.props} className="hp2-disc__desc">{s.description}</DescTag>
                <span className="hp2-disc__link">
                  <CtaLabelTag {...ctaLabel.props}>Learn more</CtaLabelTag>
                  <Icon name="arrow" size={14} />
                </span>
              </article>
            );
          })}
        </DragScrollRow>
      </div>
    </section>
  );
}
