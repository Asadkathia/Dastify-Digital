'use client';

import { useState } from 'react';
import Link from 'next/link';

export type AnnouncementBarBlockProps = {
  type: 'announcement_bar';
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  style?: 'brand' | 'dark' | 'warning' | 'success' | 'info';
  dismissible?: boolean;
  icon?: string;
};

const styleMap: Record<string, { bg: string; color: string }> = {
  brand: { bg: 'linear-gradient(90deg,#0ea5e9,#6366f1)', color: '#fff' },
  dark: { bg: '#0f172a', color: '#fff' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  success: { bg: '#d1fae5', color: '#065f46' },
  info: { bg: '#dbeafe', color: '#1e40af' },
};

export function AnnouncementBarBlock({ message, ctaLabel, ctaHref, style: barStyle = 'brand', dismissible = true, icon }: AnnouncementBarBlockProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { bg, color } = styleMap[barStyle] ?? styleMap.brand;

  return (
    <div style={{ background: bg, color, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: 500, position: 'relative' }}>
      {icon && <span>{icon}</span>}
      <span>{message}</span>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} style={{ background: 'rgba(255,255,255,0.2)', color, padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)' }}>
          {ctaLabel}
        </Link>
      )}
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color, fontSize: '18px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
