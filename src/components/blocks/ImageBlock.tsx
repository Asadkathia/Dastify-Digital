import Link from 'next/link';
import type { BuilderImage } from './types';

export type ImageBlockProps = {
  type: 'image';
  image?: BuilderImage;
  alt?: string;
  href?: string;
  openInNewTab?: boolean;
  borderRadius?: number;
  objectPosition?: string;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  caption?: string;
};

export function ImageBlock({ image, alt, href, openInNewTab, borderRadius = 0, objectPosition = 'center', maxWidth, align = 'center', caption }: ImageBlockProps) {
  if (!image?.src) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '14px', background: '#f5f5f5', borderRadius: `${borderRadius}px` }}>
        No image selected
      </div>
    );
  }

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={image.src}
      alt={alt || image.alt || ''}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: `${borderRadius}px`,
        objectFit: 'cover',
        objectPosition,
      }}
    />
  );

  return (
    <div style={{ padding: '16px 24px', textAlign: align }}>
      <div style={{ display: 'inline-block', maxWidth: maxWidth ? `${maxWidth}px` : '100%', width: '100%' }}>
        {href ? (
          <Link href={href} target={openInNewTab ? '_blank' : undefined} rel={openInNewTab ? 'noopener noreferrer' : undefined}>
            {img}
          </Link>
        ) : img}
        {caption && (
          <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>{caption}</p>
        )}
      </div>
    </div>
  );
}
