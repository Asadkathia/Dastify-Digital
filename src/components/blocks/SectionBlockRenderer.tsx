import type { PageBuilderBlock } from './types';
import { PageBlocksRenderer } from './PageBlocksRenderer';

type SectionBlockProps = Extract<PageBuilderBlock, { type: 'section' }>;

const COL_GRID: Record<string, string> = {
  '1/1': '1fr',
  '1/2': '1fr 1fr',
  '1/3': '1fr 1fr 1fr',
  '2/3': '2fr 1fr',
  '1/4': '1fr 1fr 1fr 1fr',
  '3/4': '3fr 1fr',
};

export function SectionBlockRenderer(props: SectionBlockProps) {
  const sectionStyle: React.CSSProperties = {
    ...(props.paddingTop != null ? { paddingTop: props.paddingTop } : {}),
    ...(props.paddingBottom != null ? { paddingBottom: props.paddingBottom } : {}),
    ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
  };

  const hasPadOrBg = props.paddingTop != null || props.paddingBottom != null || props.backgroundColor;

  const inner = (
    <div
      style={
        props.columns.length > 1
          ? {
              display: 'grid',
              gridTemplateColumns:
                COL_GRID[props.columns.map((c) => c.width).join('/')] ??
                `repeat(${props.columns.length}, 1fr)`,
              alignItems: 'start',
            }
          : undefined
      }
    >
      {props.columns.map((col, i) => (
        <div key={i}>
          <PageBlocksRenderer blocks={col.blocks} />
        </div>
      ))}
    </div>
  );

  if (hasPadOrBg) {
    return <div style={sectionStyle}>{inner}</div>;
  }

  return inner;
}
