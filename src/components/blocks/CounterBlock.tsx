'use client';

import { useEffect, useRef, useState } from 'react';

export type CounterBlockProps = {
  type: 'counter';
  items: Array<{ value: number; suffix?: string; prefix?: string; label: string }>;
  duration?: number;
  title?: string;
};

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function CounterBlock({ items, duration = 2000, title }: CounterBlockProps) {
  return (
    <div style={{ padding: '48px 24px', background: '#f8fafc', textAlign: 'center' }}>
      {title && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '40px', color: '#1e293b' }}>{title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`, gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
        {items?.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#0ea5e9', lineHeight: 1.1 }}>
              <AnimatedCounter target={item.value} suffix={item.suffix} prefix={item.prefix} duration={duration} />
            </div>
            <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px', fontWeight: 500 }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
