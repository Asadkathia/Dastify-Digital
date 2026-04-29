import { describe, it, expect } from 'vitest';
import { getConvertedImageBinding } from './index';

describe('getConvertedImageBinding', () => {
  it('returns hasImage=false and empty src when slot is unset', () => {
    const data = { trustLogos: [{ slug: 'a', label: 'A' }] };
    const r = getConvertedImageBinding(data, { field: 'trustLogos.0.image', defaultAlt: 'A' });
    expect(r.hasImage).toBe(false);
    expect(r.src).toBe('');
    expect(r.alt).toBe('A');
    expect(r.props['data-image-field']).toBe('true');
    expect(r.props['data-field']).toBe('trustLogos.0.image');
    expect(r.props['data-alt-field']).toBe('trustLogos.0.image.alt');
  });

  it('reads bare-string slots as { url: string } (backwards-compat)', () => {
    const data = { posts: [{ image: '/blog/post-1.webp', imageAlt: 'Post 1' }] };
    const r = getConvertedImageBinding(data, {
      field: 'posts.0.image',
      altField: 'posts.0.imageAlt',
      defaultAlt: 'fallback',
    });
    expect(r.hasImage).toBe(true);
    expect(r.src).toBe('/blog/post-1.webp');
    expect(r.alt).toBe('Post 1');
    expect(r.props['data-alt-field']).toBe('posts.0.imageAlt');
  });

  it('reads EditableImage object slots ({ mediaId, url, alt })', () => {
    const data = { hero: { image: { mediaId: 42, url: '/m/42.png', alt: 'Hero alt' } } };
    const r = getConvertedImageBinding(data, { field: 'hero.image', defaultAlt: 'fallback' });
    expect(r.hasImage).toBe(true);
    expect(r.src).toBe('/m/42.png');
    expect(r.alt).toBe('Hero alt');
    expect(r.mediaId).toBe(42);
  });

  it('falls back to defaultAlt when neither alt-field nor object alt is set', () => {
    const data = { hero: { image: { url: '/x.png' } } };
    const r = getConvertedImageBinding(data, { field: 'hero.image', defaultAlt: 'Default alt' });
    expect(r.alt).toBe('Default alt');
  });

  it('reads `src` key as fallback for legacy { src, alt } objects', () => {
    const data = { hero: { image: { src: '/legacy.png', alt: 'Legacy' } } };
    const r = getConvertedImageBinding(data, { field: 'hero.image' });
    expect(r.hasImage).toBe(true);
    expect(r.src).toBe('/legacy.png');
    expect(r.alt).toBe('Legacy');
  });
});
