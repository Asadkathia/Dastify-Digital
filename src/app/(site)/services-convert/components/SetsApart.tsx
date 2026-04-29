import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function SetsApart({ data }: { data: PageContent['setsApart'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  return (
    <section className="sv2-apart">
      <div className="sv2-wrap">
        <div className="sv2-section-head">
          <EyebrowTag {...eyebrow.props} className="sv2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="sv2-h2">{renderEmHtml(data.heading)}</HeadingTag>
        </div>
        <div className="sv2-apart__grid">
          {data.items.map((it, i) => {
            const tB = getConvertedNodeBinding(data, { field: `items.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `items.${i}.desc`, defaultTag: 'p' });
            const DTag = dB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `items.${i}.icon`, defaultAlt: it.title });
            return (
              <div key={i} className="sv2-apart__card">
                <div className="sv2-apart__num">{String(i + 1).padStart(2, '0')}</div>
                <div className="sv2-apart__icon" {...iconB.props}>
                  <Icon name={it.icon as IconName} size={22} />
                </div>
                <TTag {...tB.props}>{it.title}</TTag>
                <DTag {...dB.props}>{it.desc}</DTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
