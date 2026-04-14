export type FeatureListBlockProps = {
  type: 'feature_list';
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list' | '2col';
  columns?: '2' | '3' | '4';
  items: Array<{ icon?: string; title: string; description?: string; iconColor?: string }>;
};

export function FeatureListBlock({ title, subtitle, layout = 'grid', columns = '3', items }: FeatureListBlockProps) {
  const cols = layout === '2col' ? 2 : layout === 'list' ? 1 : Number(columns) || 3;
  const isGrid = layout !== 'list';

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
          display: 'grid',
          gridTemplateColumns: isGrid ? `repeat(${cols}, 1fr)` : '1fr',
          gap: isGrid ? '32px' : '24px',
        }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: layout === 'list' ? 'flex-start' : undefined, flexDirection: isGrid && layout !== '2col' ? 'column' : 'row' }}>
              {item.icon && (
                <div style={{ fontSize: layout === 'grid' ? '36px' : '28px', color: item.iconColor ?? '#0ea5e9', flexShrink: 0 }}>
                  {item.icon}
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{item.title}</h3>
                {item.description && <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
