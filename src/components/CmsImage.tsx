import Image from 'next/image';

type CmsImageProps = {
  src: string;
  alt: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function CmsImage({
  src,
  alt,
  objectFit = 'cover',
  objectPosition = 'center',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw',
  fill = true,
  width = 1200,
  height = 800,
}: CmsImageProps) {
  const safeSrc = src || '/images/hero-image.webp';

  if (!fill) {
    return (
      <Image
        alt={alt}
        height={height}
        priority={priority}
        sizes={sizes}
        src={safeSrc}
        width={width}
        style={{
          width: '100%',
          height: 'auto',
          objectFit,
          objectPosition,
          display: 'block',
        }}
      />
    );
  }

  return (
    <Image
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      src={safeSrc}
      style={{
        objectFit,
        objectPosition,
        display: 'block',
      }}
    />
  );
}
