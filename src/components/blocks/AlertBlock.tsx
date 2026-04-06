export type AlertBlockProps = {
  type: 'alert';
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  body: string;
  dismissible?: boolean;
};

const variantStyles: Record<string, { bg: string; border: string; icon: string; color: string }> = {
  info:    { bg: '#eff6ff', border: '#bfdbfe', icon: 'ℹ️', color: '#1e40af' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '✅', color: '#166534' },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: '⚠️', color: '#92400e' },
  error:   { bg: '#fef2f2', border: '#fecaca', icon: '🚨', color: '#991b1b' },
};

export function AlertBlock({ variant = 'info', title, body }: AlertBlockProps) {
  const vs = variantStyles[variant] ?? variantStyles.info;
  return (
    <div style={{ padding: '16px 24px' }}>
      <div style={{
        background: vs.bg,
        border: `1px solid ${vs.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1.2 }}>{vs.icon}</span>
        <div style={{ flex: 1 }}>
          {title && <p style={{ fontWeight: 700, color: vs.color, margin: '0 0 4px', fontSize: '15px' }}>{title}</p>}
          <p style={{ color: vs.color, margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{body}</p>
        </div>
      </div>
    </div>
  );
}
