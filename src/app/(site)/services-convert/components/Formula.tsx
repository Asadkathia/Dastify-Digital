import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';

export default function Formula({ data }: { data: PageContent['formula'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const pLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PLabelTag = pLabel.Tag;
  const sLabel = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'span' });
  const SLabelTag = sLabel.Tag;
  return (
    <section className="sv2-formula">
      <div className="sv2-wrap">
        <EyebrowTag {...eyebrow.props} className="sv2-eyebrow sv2-eyebrow--light sv2-formula__eyebrow">{data.eyebrow}</EyebrowTag>
        <div className="sv2-formula__grid">
          {data.items.map((it, i) => {
            const tB = getConvertedNodeBinding(data, { field: `items.${i}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const dB = getConvertedNodeBinding(data, { field: `items.${i}.desc`, defaultTag: 'p' });
            const DTag = dB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `items.${i}.icon`, defaultAlt: it.title });
            return (
              <div key={i} className="sv2-formula__card">
                <div className="sv2-formula__icon" {...iconB.props}>
                  <Icon name={it.icon as IconName} size={28} />
                </div>
                <TTag {...tB.props}>{it.title}</TTag>
                <DTag {...dB.props}>{it.desc}</DTag>
              </div>
            );
          })}
        </div>
        <div className="sv2-formula__ctas">
          <a href={data.primaryCta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="arrow" size={18} />
            <PLabelTag {...pLabel.props}>{data.primaryCta.label}</PLabelTag>
          </a>
          <a href={data.secondaryCta.href} className="sv2-btn sv2-btn--outline sv2-btn--lg">
            <SLabelTag {...sLabel.props}>{data.secondaryCta.label}</SLabelTag>
          </a>
        </div>
      </div>
    </section>
  );
}
