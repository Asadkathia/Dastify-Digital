'use client';

import React, { useEffect, useRef, useState } from 'react';

type AnimCounterProps = {
  value: string;
  label?: string;
  sublabel?: string;
  color?: string;
  className?: string;
  valueProps?: Record<string, unknown>;
  labelProps?: Record<string, unknown>;
  sublabelProps?: Record<string, unknown>;
};

// Ported from /tmp/design-drop/.../anim-counter.jsx — parses a display value
// like "+575%" or "$6.80" into prefix/number/suffix and counts up from 0
// once the element scrolls into view.
export default function AnimCounter({ value, label, sublabel, color, className, valueProps, labelProps, sublabelProps }: AnimCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);

  const raw = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const preMatch = String(value).match(/^[^0-9]*/);
  const sufMatch = String(value).match(/[^0-9.]+$/);
  const pre = preMatch ? preMatch[0] : '';
  const suf = sufMatch ? sufMatch[0] : '';
  const isDecimal = raw % 1 !== 0;
  // Preserve thousands separators if the source value used them (e.g. "1,000+").
  const useGrouping = /\d,\d{3}(?:[^\d]|$)/.test(String(value));

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

  const display = isDecimal
    ? current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping })
    : Math.floor(current).toLocaleString(undefined, { useGrouping });

  return (
    <div className={`hp2-stat${className ? ` ${className}` : ''}`} ref={ref}>
      <div {...(valueProps as object | undefined)} className="hp2-stat__n" style={{ ...(color ? { color } : null), ...((valueProps as { style?: React.CSSProperties } | undefined)?.style ?? {}) }}>
        {pre}
        {display}
        {suf}
      </div>
      {label ? <div {...(labelProps as object | undefined)} className="hp2-stat__l">{label}</div> : null}
      {sublabel ? <div {...(sublabelProps as object | undefined)} className="hp2-stat__s">{sublabel}</div> : null}
    </div>
  );
}
