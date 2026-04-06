import Link from 'next/link';

export type SocialIconsBlockProps = {
  type: 'social_icons';
  title?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  links: Array<{ platform: string; url: string }>;
};

const platformIcons: Record<string, { icon: string; color: string }> = {
  facebook:  { icon: 'f', color: '#1877f2' },
  twitter:   { icon: '𝕏', color: '#000' },
  instagram: { icon: '◎', color: '#e1306c' },
  linkedin:  { icon: 'in', color: '#0077b5' },
  youtube:   { icon: '▶', color: '#ff0000' },
  tiktok:    { icon: '♪', color: '#010101' },
  github:    { icon: '⌥', color: '#333' },
  pinterest: { icon: '𝒫', color: '#e60023' },
};

const sizeMap = { sm: 36, md: 48, lg: 60 };

export function SocialIconsBlock({ title, align = 'center', size = 'md', links }: SocialIconsBlockProps) {
  const sz = sizeMap[size] ?? 48;
  return (
    <div style={{ padding: '24px', textAlign: align }}>
      {title && <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>}
      <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
        {links?.map((link, i) => {
          const platform = link.platform?.toLowerCase();
          const meta = platformIcons[platform] ?? { icon: platform?.[0]?.toUpperCase() ?? '?', color: '#666' };
          return (
            <Link
              key={i}
              href={link.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              title={link.platform}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${sz}px`,
                height: `${sz}px`,
                borderRadius: '50%',
                background: meta.color,
                color: '#fff',
                fontSize: `${sz * 0.4}px`,
                fontWeight: 900,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              {meta.icon}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
