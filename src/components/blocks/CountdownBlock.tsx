'use client';

import { useEffect, useState } from 'react';

export type CountdownBlockProps = {
  type: 'countdown';
  title?: string;
  targetDate: string;
  expiredMessage?: string;
  layout?: 'boxes' | 'inline' | 'minimal';
  align?: 'left' | 'center' | 'right';
  accentColor?: string;
  showLabels?: boolean;
};

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(targetDate: string): Parts | null {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownBlock({ title, targetDate, expiredMessage = 'This offer has ended.', layout = 'boxes', align = 'center', accentColor = '#0ea5e9', showLabels = true }: CountdownBlockProps) {
  const [parts, setParts] = useState<Parts | null>(() => getParts(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setParts(getParts(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!parts) {
    return (
      <div style={{ padding: '48px 24px', textAlign: align }}>
        <p style={{ fontSize: '18px', color: '#64748b' }}>{expiredMessage}</p>
      </div>
    );
  }

  const units = [
    { value: parts.days, label: 'Days' },
    { value: parts.hours, label: 'Hours' },
    { value: parts.minutes, label: 'Minutes' },
    { value: parts.seconds, label: 'Seconds' },
  ];

  return (
    <div style={{ padding: '48px 24px', textAlign: align }}>
      {title && <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>{title}</h2>}
      <div style={{ display: 'inline-flex', gap: layout === 'boxes' ? '16px' : '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
        {units.map(({ value, label }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: layout === 'inline' ? '4px' : '0' }}>
            {layout === 'boxes' ? (
              <div style={{ background: accentColor, color: '#fff', borderRadius: '8px', padding: '16px 20px', minWidth: '72px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{String(value).padStart(2, '0')}</div>
                {showLabels && <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>}
              </div>
            ) : (
              <span style={{ fontSize: layout === 'minimal' ? '20px' : '28px', fontWeight: 700, color: accentColor }}>
                {String(value).padStart(2, '0')}{showLabels ? <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '2px' }}>{label}</span> : null}
              </span>
            )}
            {i < 3 && layout !== 'boxes' && <span style={{ fontSize: '24px', fontWeight: 700, color: '#94a3b8', margin: '0 4px' }}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
