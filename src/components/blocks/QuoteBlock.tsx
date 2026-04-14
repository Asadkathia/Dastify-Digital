import type { BuilderImage } from './types';

export type QuoteBlockProps = {
  type: 'quote';
  quote: string;
  author?: string;
  role?: string;
  avatar?: BuilderImage;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
  accentColor?: string;
};

const sizeMap = { sm: '18px', md: '22px', lg: '28px' };

export function QuoteBlock({ quote, author, role, avatar, size = 'md', align = 'center', accentColor = '#0ea5e9' }: QuoteBlockProps) {
  return (
    <div style={{ padding: '48px 24px', textAlign: align }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ fontSize: '72px', lineHeight: 0.6, color: accentColor, marginBottom: '24px', fontFamily: 'Georgia, serif' }}>"</div>
        <p style={{ fontSize: sizeMap[size], fontStyle: 'italic', color: '#1e293b', lineHeight: 1.6, margin: '0 0 28px' }}>
          {quote}
        </p>
        {(author || avatar) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
            {avatar?.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar.src} alt={author ?? ''} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accentColor}` }} />
            )}
            <div style={{ textAlign: 'left' }}>
              {author && <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{author}</p>}
              {role && <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{role}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
