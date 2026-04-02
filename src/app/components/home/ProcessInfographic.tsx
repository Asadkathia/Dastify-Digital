'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const STAGES = [
  {
    id: 'audit',
    icon: (uid: string) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`url(#${uid})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M11 8v6l4 2" />
      </svg>
    ),
    title: 'Audit & Diagnosis',
    desc: 'Analyze specialty demand, local competitors, and patient intent gaps.',
    gradient: ['#00D4FF', '#00B4E6'],
  },
  {
    id: 'strategy',
    icon: (uid: string) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`url(#${uid})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: 'Strategy & Build',
    desc: 'Design HIPAA-safe SEO, paid media, and conversion-focused funnels.',
    gradient: ['#3B82F6', '#2563EB'],
  },
  {
    id: 'launch',
    icon: (uid: string) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`url(#${uid})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Launch & Optimize',
    desc: 'Roll out campaigns and iterate creative, bids, and landing pages weekly.',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'scale',
    icon: (uid: string) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`url(#${uid})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: 'Scale & Retain',
    desc: 'Track booking revenue, reduce no-shows, and automate reactivation loops.',
    gradient: ['#D946EF', '#C026D3'],
  },
] as const;

export function ProcessInfographic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Viewport reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle active stage
  useEffect(() => {
    if (!revealed) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    cycleRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 4);
    }, 3000);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [revealed]);

  const handleMouseEnter = useCallback((idx: number) => {
    setHoveredIdx(idx);
    setActiveIdx(idx);
    if (cycleRef.current) clearInterval(cycleRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
    cycleRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 4);
    }, 3000);
  }, []);

  return (
    <div className="pi-root" ref={sectionRef}>
      <div className="pi-grid">
        {STAGES.map((stage, i) => {
          const isActive = hoveredIdx === i || (hoveredIdx === null && activeIdx === i);
          const gradId = `pi-grad-${stage.id}`;
          const arcGradId = `pi-arc-${stage.id}`;
          const stageDelay = `${i * 0.15}s`;

          return (
            <div
              key={stage.id}
              className={`pi-stage${revealed ? ' pi-visible' : ''}${isActive ? ' pi-active' : ''}`}
              style={{ transitionDelay: revealed ? stageDelay : '0s' }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* SVG defs for gradients */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stage.gradient[0]} />
                    <stop offset="100%" stopColor={stage.gradient[1]} />
                  </linearGradient>
                  <linearGradient id={arcGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stage.gradient[0]} />
                    <stop offset="100%" stopColor={stage.gradient[1]} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Circle plate + arc + icon */}
              <div className="pi-visual">
                {/* Arc (U-shape under the circle) */}
                <svg
                  className={`pi-arc${revealed ? ' pi-arc-visible' : ''}`}
                  style={{ transitionDelay: revealed ? `${i * 0.15 + 0.1}s` : '0s' }}
                  viewBox="0 0 140 140"
                  width="140"
                  height="140"
                >
                  <circle
                    cx="70"
                    cy="70"
                    r="64"
                    fill="none"
                    stroke={`url(#${arcGradId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="201.06 201.06"
                    strokeDashoffset="0"
                    transform="rotate(135 70 70)"
                  />
                </svg>

                {/* White circle plate */}
                <div
                  className={`pi-plate${revealed ? ' pi-plate-visible' : ''}`}
                  style={{ transitionDelay: revealed ? `${i * 0.15 + 0.05}s` : '0s' }}
                >
                  <div className="pi-icon">
                    {stage.icon(gradId)}
                  </div>
                </div>
              </div>

              {/* Stem */}
              <div
                className={`pi-stem${revealed ? ' pi-stem-visible' : ''}`}
                style={{
                  background: `linear-gradient(180deg, ${stage.gradient[0]}, ${stage.gradient[1]})`,
                  transitionDelay: revealed ? `${i * 0.15 + 0.2}s` : '0s',
                }}
              />

              {/* Step number */}
              <span
                className="pi-step"
                style={{ color: stage.gradient[0] }}
              >
                0{i + 1}
              </span>

              {/* Title */}
              <h3 className="pi-title">{stage.title}</h3>

              {/* Description */}
              <p className="pi-desc">{stage.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
