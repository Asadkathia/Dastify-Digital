export type IconBlockProps = {
  type: 'icon';
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
};

const sizeMap = { sm: '24px', md: '48px', lg: '72px', xl: '96px' };

export function IconBlock({ icon, size = 'md', color, label, align = 'center' }: IconBlockProps) {
  return (
    <div style={{ padding: '24px', textAlign: align }}>
      <div style={{ fontSize: sizeMap[size], color: color ?? 'inherit', lineHeight: 1, display: 'inline-block' }}>
        {icon}
      </div>
      {label && <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{label}</p>}
    </div>
  );
}
