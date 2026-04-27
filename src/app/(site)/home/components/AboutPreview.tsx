import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';

export default function AboutPreview({ data }: { data: HomepageContent['aboutPreview'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleTail = getConvertedNodeBinding(data, { field: 'titleTail', defaultTag: 'span' });
  const TitleTailTag = titleTail.Tag;
  const body = getConvertedNodeBinding(data, { field: 'body', defaultTag: 'p' });
  const BodyTag = body.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;
  return (
    <div className="hp2-section-tinted">
    <section className="hp2-about">
      <div className="hp2-wrap">
        <div className="hp2-about__layout">
          <div className="hp2-about__text">
            <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
            <TitleTag {...title.props} className="hp2-h2">
              {data.titleLead}
              <br />
              <TitleTailTag {...titleTail.props}>{data.titleTail}</TitleTailTag>
            </TitleTag>
            <BodyTag {...body.props} className="hp2-intro">{data.body}</BodyTag>
            <div className="hp2-about__stats">
              {data.stats.map((s, i) => {
                const vB = getConvertedNodeBinding(data, { field: `stats.${i}.value`, defaultTag: 'b' });
                const VTag = vB.Tag;
                const lB = getConvertedNodeBinding(data, { field: `stats.${i}.label`, defaultTag: 'span' });
                const LTag = lB.Tag;
                return (
                  <div key={i}>
                    <VTag {...vB.props}>{s.value}</VTag>
                    <LTag {...lB.props}>{s.label}</LTag>
                  </div>
                );
              })}
            </div>
            <div className="hp2-about__cta-wrap">
              <Link href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--md">
                <Icon name="arrow" size={16} />
                <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
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
