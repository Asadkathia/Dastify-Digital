'use client';

import type { CSSProperties, ReactNode } from 'react';
import { adminStyles } from './styles';

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export function FormField({ label, htmlFor, help, error, children, style }: FormFieldProps) {
  return (
    <div style={style}>
      {label ? (
        <label htmlFor={htmlFor} style={adminStyles.label}>
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p style={{ ...adminStyles.helpText, color: 'var(--admin-danger-text)' }}>{error}</p>
      ) : help ? (
        <p style={adminStyles.helpText}>{help}</p>
      ) : null}
    </div>
  );
}
