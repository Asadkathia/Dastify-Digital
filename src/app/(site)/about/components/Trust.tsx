import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Trust({ data }: { data: PageContent['trust'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  const badgesLabel = getConvertedNodeBinding(data, { field: 'badgesLabel', defaultTag: 'span' });
  const BadgesLabelTag = badgesLabel.Tag;
  return (
    <section className="ab2-trust">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="ab2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="ab2-h2" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        </div>
        <div className="ab2-trust__logos">
          {data.logos.map((l, i) => {
            const lB = getConvertedNodeBinding(data, { field: `logos.${i}.label`, defaultTag: 'div' });
            const LTag = lB.Tag;
            return (
              <LTag key={l.slug} {...lB.props} className="ab2-trust__logo">
                {l.label}
              </LTag>
            );
          })}
        </div>
        <div className="ab2-trust__badges">
          <BadgesLabelTag {...badgesLabel.props} className="ab2-trust__badges-label">{data.badgesLabel}</BadgesLabelTag>
          <div className="ab2-trust__badges-row">
            {data.badges.map((b, i) => {
              const altB = getConvertedNodeBinding(data, { field: `badges.${i}.alt`, defaultTag: 'span' });
              const ATag = altB.Tag;
              const imgBinding = getConvertedImageBinding(data, {
                field: `badges.${i}.image`,
                altField: `badges.${i}.alt`,
                defaultAlt: b.alt,
              });
              if (imgBinding.hidden) {
                return (
                  <div key={b.slug} {...imgBinding.props} data-image-hidden="true" className="iph ab2-trust__badge-ph" aria-label={b.alt}>
                    <ATag {...altB.props}>{b.alt}</ATag>
                  </div>
                );
              }
              return imgBinding.hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.slug}
                  {...imgBinding.props}
                  src={imgBinding.src}
                  alt={imgBinding.alt || b.alt}
                  className="ab2-trust__badge-img"
                />
              ) : (
                <div key={b.slug} {...imgBinding.props} className="iph ab2-trust__badge-ph" aria-label={b.alt}>
                  <ATag {...altB.props}>{b.alt}</ATag>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
