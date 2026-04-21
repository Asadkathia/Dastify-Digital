'use client';

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { adminStyles } from './styles';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
};

const variantMap: Record<Variant, CSSProperties> = {
  primary: adminStyles.buttonPrimary,
  secondary: adminStyles.buttonSecondary,
  danger: adminStyles.buttonDanger,
};

const sizeMap: Record<Size, CSSProperties> = {
  sm: { padding: '4px 10px', fontSize: 'var(--admin-text-sm)' },
  md: { padding: '8px 12px', fontSize: 'var(--admin-text-base)' },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={{
        ...adminStyles.buttonBase,
        ...variantMap[variant],
        ...sizeMap[size],
        ...(isDisabled ? adminStyles.buttonDisabled : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
