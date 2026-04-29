import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Comparison({ data }: { data: PageContent['comparison'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const badHeader = getConvertedNodeBinding(data, { field: 'badHeader', defaultTag: 'div' });
  const BadHeaderTag = badHeader.Tag;
  const goodHeader = getConvertedNodeBinding(data, { field: 'goodHeader', defaultTag: 'div' });
  const GoodHeaderTag = goodHeader.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'cta.label', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;
  return (
    <section className="sv2-comparison">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="sv2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="sv2-h2">{renderEmHtml(data.heading)}</HeadingTag>
          <IntroTag {...intro.props} className="sv2-intro">{data.intro}</IntroTag>
        </div>
        <div className="sv2-compare">
          <div className="sv2-compare__head">
            <BadHeaderTag {...badHeader.props} className="sv2-compare__col-bad">{data.badHeader}</BadHeaderTag>
            <div className="sv2-compare__arrow-col" aria-hidden="true" />
            <GoodHeaderTag {...goodHeader.props} className="sv2-compare__col-good">{data.goodHeader}</GoodHeaderTag>
          </div>
          {data.rows.map((r, i) => {
            const bB = getConvertedNodeBinding(data, { field: `rows.${i}.bad`, defaultTag: 'span' });
            const BTag = bB.Tag;
            const gB = getConvertedNodeBinding(data, { field: `rows.${i}.good`, defaultTag: 'b' });
            const GTag = gB.Tag;
            const gsB = getConvertedNodeBinding(data, { field: `rows.${i}.goodSub`, defaultTag: 'p' });
            const GSTag = gsB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `rows.${i}.icon`, defaultAlt: r.good });
            return (
              <div key={i} className="sv2-compare__row">
                <div className="sv2-compare__bad">
                  <Icon name="heart" size={16} />
                  <BTag {...bB.props}>{r.bad}</BTag>
                </div>
                <div className="sv2-compare__arrow-col">
                  <Icon name="arrow" size={20} />
                </div>
                <div className="sv2-compare__good">
                  <div className="sv2-compare__good-icon" {...iconB.props}>
                    <Icon name={r.icon as IconName} size={20} />
                  </div>
                  <div>
                    <GTag {...gB.props}>{r.good}</GTag>
                    <GSTag {...gsB.props}>{r.goodSub}</GSTag>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="sv2-compare__cta">
          <a href={data.cta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="calendar" size={18} />
            <CtaLabelTag {...ctaLabel.props}>{data.cta.label}</CtaLabelTag>
          </a>
        </div>
      </div>
    </section>
  );
}
