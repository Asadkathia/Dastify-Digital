import type { PageBuilderBlock } from './types';

type SpacerBlockProps = Extract<PageBuilderBlock, { type: 'spacer' }>;

export function SpacerBlock(props: SpacerBlockProps) {
  return (
    <div style={{ height: `${props.height}px`, display: 'flex', alignItems: 'center' }}>
      {props.showDivider ? (
        <hr
          style={{
            width: '100%',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,.1)',
            margin: 0,
          }}
        />
      ) : null}
    </div>
  );
}
