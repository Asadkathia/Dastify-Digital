'use client';

import type { ReactNode } from 'react';
import { adminStyles } from './styles';

type Tone = 'success' | 'error' | 'warning';

type StatusMessageProps = {
  tone: Tone;
  children: ReactNode;
};

const toneMap = {
  success: adminStyles.statusSuccess,
  error: adminStyles.statusError,
  warning: adminStyles.statusWarning,
};

export function StatusMessage({ tone, children }: StatusMessageProps) {
  return <div role={tone === 'error' ? 'alert' : 'status'} style={toneMap[tone]}>{children}</div>;
}
