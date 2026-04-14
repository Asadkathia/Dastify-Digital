export type StepsBlockProps = {
  type: 'steps';
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical' | 'cards';
  accentColor?: string;
  steps: Array<{ icon?: string; title: string; description?: string }>;
};

export function StepsBlock({ title, subtitle, layout = 'horizontal', accentColor = '#0ea5e9', steps }: StepsBlockProps) {
  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            {title && <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{title}</h2>}
            {subtitle && <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>{subtitle}</p>}
          </div>
        )}
        <div style={{
          display: 'flex',
          flexDirection: layout === 'vertical' ? 'column' : 'row',
          gap: layout === 'cards' ? '24px' : '0',
          flexWrap: layout === 'cards' ? 'wrap' : 'nowrap',
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              flex: layout !== 'vertical' ? '1' : undefined,
              display: 'flex',
              flexDirection: layout === 'vertical' ? 'row' : 'column',
              gap: layout === 'vertical' ? '20px' : '16px',
              alignItems: layout === 'vertical' ? 'flex-start' : 'center',
              textAlign: layout !== 'vertical' ? 'center' : 'left',
              padding: layout === 'cards' ? '28px' : '0 16px',
              border: layout === 'cards' ? '1px solid #e2e8f0' : 'none',
              borderRadius: layout === 'cards' ? '12px' : '0',
              position: 'relative',
            }}>
              <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '50%', background: accentColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: step.icon ? '24px' : '22px', fontWeight: 700 }}>
                {step.icon || (i + 1)}
              </div>
              {layout === 'horizontal' && i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: '28px', left: 'calc(50% + 28px)', right: 'calc(-50% + 28px)', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
              )}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{step.title}</h3>
                {step.description && <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{step.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
