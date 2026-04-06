'use client';

import { useEffect, useRef, useState } from 'react';

export type ProgressBarBlockProps = {
  type: 'progress_bar';
  title?: string;
  items: Array<{ label: string; value: number; color?: string }>;
};

function Bar({ label, value, color = '#0ea5e9' }: { label: string; value: number; color?: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth(Math.min(Math.max(value, 0), 100)), 100);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>{value}%</span>
      </div>
      <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: color, borderRadius: '999px', width: `${width}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
    </div>
  );
}

export function ProgressBarBlock({ title, items }: ProgressBarBlockProps) {
  return (
    <div style={{ padding: '32px 24px', maxWidth: '700px', margin: '0 auto' }}>
      {title && <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '28px', color: '#1e293b' }}>{title}</h2>}
      {items?.map((item, i) => <Bar key={i} {...item} />)}
    </div>
  );
}
