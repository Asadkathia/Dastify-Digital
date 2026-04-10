import type { CSSProperties } from 'react';
import { CmsImage } from '@/components/CmsImage';

type MediaValue =
  | string
  | {
      url?: string;
      alt?: string;
      filename?: string;
    }
  | null
  | undefined;

type ConvertedPlaceholderImageProps = {
  image?: MediaValue;
  imageAlt?: string;
  imageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imagePosition?: string;
  imageRadius?: string;
  preservePlaceholderChrome?: boolean;
  placeholderBackground?: string;
  placeholderBorderColor?: string;
  placeholderBorderWidth?: string;
  placeholderBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  placeholderPadding?: string;
  placeholderGap?: string;
  placeholderRadius?: string;
  placeholderShowOverlay?: boolean;
  placeholderOverlay?: string;
  placeholderLabelColor?: string;
  placeholderLabelSize?: string;
  placeholderDimColor?: string;
  placeholderDimSize?: string;
  placeholderIconSize?: string;
  placeholderIcon: string;
  placeholderLabel: string;
  placeholderDimensions: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
};

function resolveImage(image: MediaValue, imageAlt?: string): { src: string; alt: string } | null {
  if (!image) return null;

  if (typeof image === 'string') {
    const src = image.trim();
    return src ? { src, alt: imageAlt?.trim() || '' } : null;
  }

  const src = image.url?.trim() || (image.filename?.trim() ? `/media/${image.filename.trim()}` : '');
  if (!src) return null;

  return {
    src,
    alt: imageAlt?.trim() || image.alt?.trim() || '',
  };
}

function parseRadius(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

function nonEmpty(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function ConvertedPlaceholderImage({
  image,
  imageAlt,
  imageFit = 'cover',
  imagePosition = 'center',
  imageRadius,
  preservePlaceholderChrome = false,
  placeholderBackground,
  placeholderBorderColor,
  placeholderBorderWidth,
  placeholderBorderStyle,
  placeholderPadding,
  placeholderGap,
  placeholderRadius,
  placeholderShowOverlay = true,
  placeholderOverlay,
  placeholderLabelColor,
  placeholderLabelSize,
  placeholderDimColor,
  placeholderDimSize,
  placeholderIconSize,
  placeholderIcon,
  placeholderLabel,
  placeholderDimensions,
  className,
  style,
  sizes,
}: ConvertedPlaceholderImageProps) {
  const resolved = resolveImage(image, imageAlt);
  const radius = parseRadius(imageRadius ?? placeholderRadius);
  const chromeEnabled = !resolved || preservePlaceholderChrome;
  const backgroundValue = chromeEnabled ? (nonEmpty(placeholderBackground) ?? 'var(--bg3)') : 'transparent';
  const borderColorValue = chromeEnabled ? (nonEmpty(placeholderBorderColor) ?? 'var(--bd-md)') : 'transparent';
  const borderWidthValue = chromeEnabled ? (nonEmpty(placeholderBorderWidth) ?? '1.5px') : '0px';
  const borderStyleValue = chromeEnabled ? (placeholderBorderStyle ?? 'dashed') : 'none';
  const paddingValue = chromeEnabled ? (nonEmpty(placeholderPadding) ?? '40px 24px') : '0px';
  const gapValue = nonEmpty(placeholderGap) ?? '10px';
  const overlayValue = chromeEnabled
    ? (nonEmpty(placeholderOverlay) ?? 'linear-gradient(135deg, var(--blue-lt), transparent 60%)')
    : 'none';
  const labelColorValue = nonEmpty(placeholderLabelColor) ?? 'var(--blue)';
  const labelSizeValue = nonEmpty(placeholderLabelSize) ?? '10px';
  const dimColorValue = nonEmpty(placeholderDimColor) ?? 'var(--t3)';
  const dimSizeValue = nonEmpty(placeholderDimSize) ?? '11px';
  const iconSizeValue = nonEmpty(placeholderIconSize) ?? '28px';

  const cssVars = {
    '--iph-bg': backgroundValue,
    '--iph-border-color': borderColorValue,
    '--iph-border-width': borderWidthValue,
    '--iph-border-style': borderStyleValue,
    '--iph-padding': paddingValue,
    '--iph-gap': gapValue,
    '--iph-radius': radius || undefined,
    '--iph-overlay': overlayValue,
    '--iph-overlay-display': chromeEnabled && placeholderShowOverlay ? 'block' : 'none',
    '--iph-label-color': labelColorValue,
    '--iph-label-size': labelSizeValue,
    '--iph-dim-color': dimColorValue,
    '--iph-dim-size': dimSizeValue,
    '--iph-icon-size': iconSizeValue,
  } as CSSProperties;

  if (resolved) {
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius,
          ...cssVars,
          ...style,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <CmsImage
            src={resolved.src}
            alt={resolved.alt || placeholderLabel}
            sizes={sizes}
            objectFit={imageFit}
            objectPosition={imagePosition}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ borderRadius: radius, ...cssVars, ...style }}
    >
      <div className="iph-ic">{placeholderIcon}</div>
      <span className="iph-lbl">{placeholderLabel}</span>
      <span className="iph-dim">{placeholderDimensions}</span>
    </div>
  );
}
