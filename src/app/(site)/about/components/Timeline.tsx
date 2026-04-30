import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Timeline({ data }: { data: PageContent['timeline'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  return (
    <section className="ab2-timeline">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="ab2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="ab2-h2" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        </div>
        <div
          className="ab2-timeline__htrack"
          style={{ gridTemplateColumns: `repeat(${data.milestones.length}, 1fr)` }}
        >
          <div className="ab2-timeline__hline" aria-hidden="true" />
          {data.milestones.map((m, i) => {
            const yB = getConvertedNodeBinding(data, { field: `milestones.${i}.year`, defaultTag: 'div' });
            const YTag = yB.Tag;
            const tB = getConvertedNodeBinding(data, { field: `milestones.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `milestones.${i}.description`, defaultTag: 'p' });
            const DTag = dB.Tag;
            return (
              <div key={i} className="ab2-timeline__hitem">
                <div className="ab2-timeline__hdot" />
                <YTag {...yB.props} className="ab2-timeline__hyear">{m.year}</YTag>
                <TTag {...tB.props}>{m.title}</TTag>
                <DTag {...dB.props}>{m.description}</DTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
