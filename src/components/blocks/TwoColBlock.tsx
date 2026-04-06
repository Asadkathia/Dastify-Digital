import type { PageBuilderBlock } from './types';

type TwoColBlockProps = Extract<PageBuilderBlock, { type: 'two_col' }>;

const gapMap = { small: '16px', medium: '32px', large: '64px' } as const;

export function TwoColBlock(props: TwoColBlockProps) {
  const gap = gapMap[props.gap ?? 'medium'];

  return (
    <section className="sp">
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, alignItems: 'start' }}>
        <div>
          {props.leftTitle ? <h2 data-field="leftTitle" style={{ marginBottom: '12px' }}>{props.leftTitle}</h2> : null}
          {props.leftText ? <p data-field="leftText" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.leftText}</p> : null}
        </div>
        <div>
          {props.rightTitle ? <h2 data-field="rightTitle" style={{ marginBottom: '12px' }}>{props.rightTitle}</h2> : null}
          {props.rightText ? <p data-field="rightText" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.rightText}</p> : null}
        </div>
      </div>
    </section>
  );
}
