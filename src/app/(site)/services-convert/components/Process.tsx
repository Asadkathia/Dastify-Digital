import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Process({ data }: { data: PageContent['process'] }) {
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  return (
    <section className="sv2-process">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center sv2-section-head--light">
          <HeadingTag {...heading.props} className="sv2-h2 sv2-h2--light">{renderEmHtml(data.heading)}</HeadingTag>
        </div>
        <div className="sv2-process__track">
          {data.steps.map((s, i) => {
            const tB = getConvertedNodeBinding(data, { field: `steps.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `steps.${i}.desc`, defaultTag: 'p' });
            const DTag = dB.Tag;
            return (
              <div key={i} className="sv2-process__step">
                <div className="sv2-process__num">{i + 1}</div>
                <TTag {...tB.props}>{s.title}</TTag>
                <DTag {...dB.props}>{s.desc}</DTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
