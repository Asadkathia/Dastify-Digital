import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';
import { WidgetListRenderer } from './WidgetRenderer';

type Props = { widget: WidgetInstance };

export function ColumnsWidget({ widget }: Props) {
  const { columnCount = '2', gap = '16' } = widget.data as {
    columnCount?: string; gap?: string;
  };

  const cols = Math.max(2, Math.min(4, parseInt(columnCount, 10) || 2));
  const gapPx = `${parseInt(gap, 10) || 16}px`;

  // Children are split evenly across columns
  const children = widget.children ?? [];
  const columns: WidgetInstance[][] = Array.from({ length: cols }, () => []);
  children.forEach((child, i) => columns[i % cols].push(child));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gapPx,
        ...applyWidgetStyles(widget.styles),
      }}
    >
      {columns.map((colWidgets, colIdx) => (
        <div
          key={colIdx}
          data-columns-col={colIdx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: '40px',
            border: colWidgets.length === 0 ? '1px dashed #334155' : 'none',
            borderRadius: '4px',
            padding: colWidgets.length === 0 ? '8px' : undefined,
          }}
        >
          {colWidgets.length === 0 ? (
            <span style={{ color: '#475569', fontSize: '11px', textAlign: 'center' }}>Col {colIdx + 1}</span>
          ) : (
            <WidgetListRenderer widgets={colWidgets} />
          )}
        </div>
      ))}
    </div>
  );
}
