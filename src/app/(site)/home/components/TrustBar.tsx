import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';

export default function TrustBar({ data }: { data: HomepageContent['trustBar'] }) {
  const labelNode = getConvertedNodeBinding(data, { field: 'label', defaultTag: 'span' });
  const LabelTag = labelNode.Tag;
  return (
    <section className="hp2-trustbar">
      <div className="hp2-wrap">
        <LabelTag {...labelNode.props} className="hp2-trustbar__label">{data.label}</LabelTag>
        <div className="hp2-trustbar__track">
          {data.logos.map((l, i) => {
            const logoNode = getConvertedNodeBinding(data, { field: `logos.${i}`, defaultTag: 'div' });
            const LTag = logoNode.Tag;
            return (
              <LTag key={i} {...logoNode.props} className="hp2-trustbar__logo">
                {l}
              </LTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
