import type { BuilderImage } from './types';

export type TeamGridBlockProps = {
  type: 'team_grid';
  title?: string;
  subtitle?: string;
  columns?: '2' | '3' | '4';
  cardStyle?: 'default' | 'minimal' | 'card';
  members: Array<{
    photo?: BuilderImage;
    name: string;
    role?: string;
    bio?: string;
    linkedinUrl?: string;
    email?: string;
  }>;
};

export function TeamGridBlock({ title, subtitle, columns = '3', cardStyle = 'default', members }: TeamGridBlockProps) {
  const cols = Number(columns) || 3;
  const isCard = cardStyle === 'card';

  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            {title && <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{title}</h2>}
            {subtitle && <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '32px' }}>
          {members.map((m, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: isCard ? '28px' : '0',
              border: isCard ? '1px solid #e2e8f0' : 'none',
              borderRadius: isCard ? '12px' : '0',
              background: isCard ? '#fff' : 'transparent',
            }}>
              {m.photo?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo.src} alt={m.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
              ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#94a3b8' }}>
                  👤
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{m.name}</h3>
              {m.role && <p style={{ fontSize: '14px', color: '#0ea5e9', fontWeight: 600, margin: '0 0 10px' }}>{m.role}</p>}
              {m.bio && cardStyle !== 'minimal' && <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.6 }}>{m.bio}</p>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {m.linkedinUrl && <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>LinkedIn</a>}
                {m.email && <a href={`mailto:${m.email}`} style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Email</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
