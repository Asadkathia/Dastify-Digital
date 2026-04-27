import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

export default function CtaBanner({ data }: { data: PageContent['ctaBanner'] }) {
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const sub = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = sub.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'cta.label', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;
  return (
    <section className="sv2-cta-banner">
      <div className="sv2-wrap">
        <div className="sv2-cta-banner__box">
          <div className="sv2-cta-banner__orb" aria-hidden="true" />
          <div className="sv2-cta-banner__content">
            <HeadingTag {...heading.props}>{data.heading}</HeadingTag>
            <SubTag {...sub.props}>{data.sub}</SubTag>
            <ul className="sv2-cta-banner__list">
              {data.bullets.map((b, i) => {
                const bB = getConvertedNodeBinding(data, { field: `bullets.${i}`, defaultTag: 'span' });
                const BTag = bB.Tag;
                return (
                  <li key={i}>
                    <Icon name="check" size={16} />
                    <BTag {...bB.props}>{b}</BTag>
                  </li>
                );
              })}
            </ul>
            <a href={data.cta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg sv2-cta-banner__cta">
              <Icon name="calendar" size={18} />
              <CtaLabelTag {...ctaLabel.props}>{data.cta.label}</CtaLabelTag>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
