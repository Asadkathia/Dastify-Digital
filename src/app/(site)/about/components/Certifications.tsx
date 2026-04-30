import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Certifications({ data }: { data: PageContent['certifications'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  return (
    <section className="ab2-certs">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center ab2-section-head--light">
          <EyebrowTag {...eyebrow.props} className="ab2-eyebrow ab2-eyebrow--light">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="ab2-h2 ab2-h2--light" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        </div>
        <div className="ab2-certs__grid">
          {data.items.map((c, i) => {
            const tB = getConvertedNodeBinding(data, { field: `items.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `items.${i}.description`, defaultTag: 'p' });
            const DTag = dB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `items.${i}.icon`, defaultAlt: c.title });
            return (
              <div key={i} className="ab2-certs__card">
                <div className="ab2-certs__icon" {...iconB.props}>
                  <Icon name={c.icon as IconName} size={24} />
                </div>
                <TTag {...tB.props}>{c.title}</TTag>
                <DTag {...dB.props}>{c.description}</DTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
