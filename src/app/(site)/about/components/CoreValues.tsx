import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function CoreValues({ data }: { data: PageContent['coreValues'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  return (
    <section className="ab2-values">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="ab2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="ab2-h2">{renderEmHtml(data.heading)}</HeadingTag>
        </div>
        <div className="ab2-values__grid">
          {data.items.map((v, i) => {
            const tB = getConvertedNodeBinding(data, { field: `items.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `items.${i}.description`, defaultTag: 'p' });
            const DTag = dB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `items.${i}.icon`, defaultAlt: v.title });
            return (
              <div key={i} className="ab2-values__card">
                <div className="ab2-values__card-icon" {...iconB.props}>
                  <Icon name={v.icon as IconName} size={22} />
                </div>
                <TTag {...tB.props}>{v.title}</TTag>
                <DTag {...dB.props}>{v.description}</DTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
