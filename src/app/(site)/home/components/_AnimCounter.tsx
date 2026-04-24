'use client';

import { useEffect, useRef, useState } from 'react';

type AnimCounterProps = {
  value: string;
  label?: string;
  sublabel?: string;
  color?: string;
  className?: string;
};

// Ported from /tmp/design-drop/.../anim-counter.jsx — parses a display value
// like "+575%" or "$6.80" into prefix/number/suffix and counts up from 0
// once the element scrolls into view.
export default function AnimCounter({ value, label, sublabel, color, className }: AnimCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);

  const raw = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const preMatch = String(value).match(/^[^0-9]*/);
  const sufMatch = String(value).match(/[^0-9.]+$/);
  const pre = preMatch ? preMatch[0] : '';
  const suf = sufMatch ? sufMatch[0] : '';
  const isDecimal = raw % 1 !== 0;

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1600;
    let rafId = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const next = ease * raw;
      setCurrent(isDecimal ? parseFloat(next.toFixed(2)) : Math.floor(next));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setCurrent(raw);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, raw, isDecimal]);

  const display = isDecimal ? current.toFixed(2) : Math.floor(current);

  return (
    <div className={`hp2-stat${className ? ` ${className}` : ''}`} ref={ref}>
      <div className="hp2-stat__n" style={color ? { color } : undefined}>
        {pre}
        {display}
        {suf}
      </div>
      {label ? <div className="hp2-stat__l">{label}</div> : null}
      {sublabel ? <div className="hp2-stat__s">{sublabel}</div> : null}
    </div>
  );
}
