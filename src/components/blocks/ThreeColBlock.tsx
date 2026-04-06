import type { PageBuilderBlock } from './types';

type ThreeColBlockProps = Extract<PageBuilderBlock, { type: 'three_col' }>;

const gapMap = { small: '16px', medium: '32px', large: '64px' } as const;

export function ThreeColBlock(props: ThreeColBlockProps) {
  const gap = gapMap[props.gap ?? 'medium'];

  return (
    <section className="sp">
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap, alignItems: 'start' }}>
        <div>
          {props.col1Title ? <h3 data-field="col1Title" style={{ marginBottom: '10px' }}>{props.col1Title}</h3> : null}
          {props.col1Text ? <p data-field="col1Text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.col1Text}</p> : null}
        </div>
        <div>
          {props.col2Title ? <h3 data-field="col2Title" style={{ marginBottom: '10px' }}>{props.col2Title}</h3> : null}
          {props.col2Text ? <p data-field="col2Text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.col2Text}</p> : null}
        </div>
        <div>
          {props.col3Title ? <h3 data-field="col3Title" style={{ marginBottom: '10px' }}>{props.col3Title}</h3> : null}
          {props.col3Text ? <p data-field="col3Text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.col3Text}</p> : null}
        </div>
      </div>
    </section>
  );
}
