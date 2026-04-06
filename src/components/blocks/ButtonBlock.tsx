import Link from 'next/link';

export type ButtonBlockProps = {
  type: 'button';
  label: string;
  href?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  align?: 'left' | 'center' | 'right';
  openInNewTab?: boolean;
};

const sizeMap = {
  sm: { padding: '8px 20px', fontSize: '14px' },
  md: { padding: '12px 28px', fontSize: '16px' },
  lg: { padding: '16px 40px', fontSize: '18px' },
};

export function ButtonBlock({ label, href = '#', variant = 'solid', size = 'md', color = '#0ea5e9', align = 'center', openInNewTab }: ButtonBlockProps) {
  const sz = sizeMap[size] ?? sizeMap.md;

  const base: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.15s',
    ...sz,
  };

  const variantStyle: React.CSSProperties =
    variant === 'outline'
      ? { background: 'transparent', border: `2px solid ${color}`, color }
      : variant === 'ghost'
        ? { background: 'transparent', border: 'none', color }
        : { background: color, border: `2px solid ${color}`, color: '#fff' };

  return (
    <div style={{ padding: '16px 24px', textAlign: align }}>
      <Link
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        style={{ ...base, ...variantStyle }}
      >
        {label}
      </Link>
    </div>
  );
}
