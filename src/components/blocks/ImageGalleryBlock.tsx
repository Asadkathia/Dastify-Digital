'use client';

import { useState } from 'react';
import type { BuilderImage } from './types';

export type ImageGalleryBlockProps = {
  type: 'image_gallery';
  title?: string;
  columns?: 2 | 3 | 4;
  images: Array<{ image: BuilderImage; alt?: string; caption?: string }>;
  lightbox?: boolean;
};

export function ImageGalleryBlock({ title, columns = 3, images, lightbox = true }: ImageGalleryBlockProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div style={{ padding: '32px 24px' }}>
      {title && <h2 style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: '#1e293b' }}>{title}</h2>}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '12px' }}>
        {images?.map((item, i) => (
          <div
            key={i}
            onClick={() => lightbox && setLightboxIndex(i)}
            style={{ cursor: lightbox ? 'zoom-in' : 'default', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#f1f5f9' }}
          >
            {item.image?.src && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.image.src}
                alt={item.alt || item.image.alt || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightbox && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p !== null && p > 0 ? p - 1 : images.length - 1)); }}
            style={{ position: 'absolute', left: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px' }}
          >‹</button>
          <div style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}>
            {images[lightboxIndex]?.image?.src && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={images[lightboxIndex].image.src} alt="" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
            )}
            {images[lightboxIndex]?.caption && (
              <p style={{ color: '#ccc', marginTop: '12px', fontSize: '14px' }}>{images[lightboxIndex].caption}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p !== null && p < images.length - 1 ? p + 1 : 0)); }}
            style={{ position: 'absolute', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px' }}
          >›</button>
          <button
            onClick={() => setLightboxIndex(null)}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
          >✕</button>
        </div>
      )}
    </div>
  );
}
