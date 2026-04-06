export type HeadingBlockProps = {
  type: 'heading';
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'left' | 'center' | 'right';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const sizeMap: Record<string, string> = {
  xs: '16px',
  sm: '20px',
  md: '28px',
  lg: '36px',
  xl: '48px',
  '2xl': '64px',
};

export function HeadingBlock({ text, tag = 'h2', align = 'left', color, size = 'lg' }: HeadingBlockProps) {
  const Tag = tag;
  return (
    <div style={{ padding: '8px 24px' }}>
      <Tag
        style={{
          textAlign: align,
          color: color || undefined,
          fontSize: sizeMap[size] ?? sizeMap.lg,
          fontWeight: 700,
          lineHeight: 1.2,
          margin: 0,
        }}
        data-field="text"
      >
        {text}
      </Tag>
    </div>
  );
}
