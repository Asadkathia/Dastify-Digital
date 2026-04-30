import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtmlString } from '../../home/components/_emHtml';
import AnimCounter from '../../home/components/_AnimCounter';

export default function Stats({ data }: { data: PageContent['stats'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  return (
    <section className="ab2-stats">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center ab2-section-head--light">
          <EyebrowTag {...eyebrow.props} className="ab2-eyebrow ab2-eyebrow--light">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="ab2-h2 ab2-h2--light" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        </div>
        <div className="ab2-stats__grid">
          {data.items.map((s, i) => {
            const vB = getConvertedNodeBinding(data, { field: `items.${i}.value`, defaultTag: 'span' });
            const lB = getConvertedNodeBinding(data, { field: `items.${i}.label`, defaultTag: 'span' });
            return (
              <div key={i} className="ab2-stats__tile">
                <AnimCounter value={s.value} label={s.label} className="ab2-stats__counter" valueProps={vB.props} labelProps={lB.props} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
