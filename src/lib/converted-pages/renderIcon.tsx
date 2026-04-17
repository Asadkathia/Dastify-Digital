import React from 'react';

/**
 * Renders an icon field value — either an uploaded image URL or an emoji string.
 * Used across all converted page components that have icon fields.
 */
export function renderIcon(value: string, className?: string, styleOverride?: React.CSSProperties): React.ReactNode {
  if (!value) return null;
  const isImage = value.startsWith('/') || value.startsWith('http');
  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt=""
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', ...styleOverride }}
      />
    );
  }
  if (styleOverride) {
    return <span style={styleOverride}>{value}</span>;
  }
  return <>{value}</>;
}
