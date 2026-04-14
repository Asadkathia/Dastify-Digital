export type TimelineBlockProps = {
  type: 'timeline';
  title?: string;
  subtitle?: string;
  layout?: 'vertical' | 'horizontal' | 'alternating';
  items: Array<{ date?: string; title: string; description?: string; icon?: string; accentColor?: string }>;
};

export function TimelineBlock({ title, subtitle, layout = 'vertical', items }: TimelineBlockProps) {
  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            {title && <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{title}</h2>}
            {subtitle && <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>{subtitle}</p>}
          </div>
        )}
        {layout === 'horizontal' ? (
          <div style={{ display: 'flex', overflowX: 'auto', gap: '0', position: 'relative' }}>
            {items.map((item, i) => (
              <div key={i} style={{ flex: '1', textAlign: 'center', padding: '0 16px', position: 'relative', minWidth: '150px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.accentColor ?? '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', margin: '0 auto 12px', position: 'relative', zIndex: 1 }}>
                  {item.icon || (i + 1)}
                </div>
                {i < items.length - 1 && <div style={{ position: 'absolute', top: '20px', left: '50%', width: '100%', height: '2px', background: '#e2e8f0', zIndex: 0 }} />}
                {item.date && <p style={{ fontSize: '12px', fontWeight: 600, color: item.accentColor ?? '#0ea5e9', margin: '0 0 4px', textTransform: 'uppercase' }}>{item.date}</p>}
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{item.title}</h3>
                {item.description && <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: layout === 'alternating' ? '0' : '48px' }}>
            {layout !== 'alternating' && <div style={{ position: 'absolute', left: '18px', top: 0, bottom: 0, width: '2px', background: '#e2e8f0' }} />}
            {items.map((item, i) => {
              const isRight = layout === 'alternating' && i % 2 === 1;
              return (
                <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexDirection: layout === 'alternating' ? (isRight ? 'row-reverse' : 'row') : 'row' }}>
                  <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: item.accentColor ?? '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {item.icon || (i + 1)}
                  </div>
                  <div style={{ paddingTop: '8px', textAlign: layout === 'alternating' && isRight ? 'right' : 'left' }}>
                    {item.date && <p style={{ fontSize: '12px', fontWeight: 600, color: item.accentColor ?? '#0ea5e9', margin: '0 0 4px', textTransform: 'uppercase' }}>{item.date}</p>}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{item.title}</h3>
                    {item.description && <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
