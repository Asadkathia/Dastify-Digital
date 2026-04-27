import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import AnimCounter from '../../home/components/_AnimCounter';

const COLOR_VAR: Record<'primary' | 'accent' | 'support', string> = {
  primary: 'var(--primary)',
  accent: 'var(--accent)',
  support: 'var(--support)',
};

export default function StatsBar({ data }: { data: PageContent['stats'] }) {
  const labelNode = getConvertedNodeBinding(data, { field: 'label', defaultTag: 'div' });
  const LabelTag = labelNode.Tag;
  return (
    <section className="sv2-stats">
      <div className="sv2-wrap">
        <LabelTag {...labelNode.props} className="sv2-stats__label">{data.label}</LabelTag>
        <div className="sv2-stats__grid">
          {data.items.map((s, i) => {
            const aB = getConvertedNodeBinding(data, { field: `items.${i}.arrow`, defaultTag: 'span' });
            const ATag = aB.Tag;
            const vB = getConvertedNodeBinding(data, { field: `items.${i}.value`, defaultTag: 'span' });
            const lB = getConvertedNodeBinding(data, { field: `items.${i}.label`, defaultTag: 'span' });
            return (
              <div key={i} className="sv2-stat">
                {s.arrow ? <ATag {...aB.props} className="sv2-stat__arrow" style={{ color: COLOR_VAR[s.color], ...((aB.props.style as React.CSSProperties) ?? {}) }}>{s.arrow}</ATag> : null}
                <AnimCounter value={s.value} label={s.label} color={COLOR_VAR[s.color]} className="sv2-stat__counter" valueProps={vB.props} labelProps={lB.props} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
