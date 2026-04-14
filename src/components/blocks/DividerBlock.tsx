export type DividerBlockProps = {
  type: 'divider';
  style?: 'line' | 'dashed' | 'dotted' | 'none';
  color?: string;
  thickness?: number;
  spacing?: number;
  width?: 'full' | '75' | '50' | '25';
};

const widthMap: Record<string, string> = { full: '100%', '75': '75%', '50': '50%', '25': '25%' };

export function DividerBlock({ style = 'line', color = '#e2e8f0', thickness = 1, spacing = 32, width = 'full' }: DividerBlockProps) {
  if (style === 'none') {
    return <div style={{ height: `${spacing}px` }} />;
  }

  return (
    <div style={{ padding: `${spacing}px 24px`, display: 'flex', justifyContent: 'center' }}>
      <hr style={{
        width: widthMap[width] ?? '100%',
        border: 'none',
        borderTop: `${thickness}px ${style} ${color}`,
        margin: 0,
      }} />
    </div>
  );
}
