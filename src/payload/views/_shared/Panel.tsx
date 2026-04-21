'use client';

import type { CSSProperties, ReactNode } from 'react';
import { adminStyles } from './styles';

type PanelProps = {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export function Panel({ title, children, style }: PanelProps) {
  return (
    <section style={{ ...adminStyles.panel, ...style }}>
      {title ? <h2 style={adminStyles.heading2}>{title}</h2> : null}
      {children}
    </section>
  );
}
