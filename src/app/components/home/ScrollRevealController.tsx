'use client';

import { useEffect } from 'react';

const counted = new Set<Element>();

export function ScrollRevealController() {
  useEffect(() => {
    const initLines = () => {
      document.querySelectorAll<HTMLElement>('.line-inner').forEach((el) => {
        const target = el.closest('.line-wrap') ?? el;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.classList.add('revealed');
              observer.disconnect();
            }
          },
          { threshold: 0.2 },
        );
        observer.observe(target);
      });

      document.querySelectorAll<HTMLElement>('.hero-h1 .line-inner').forEach((el, i) => {
        window.setTimeout(() => el.classList.add('revealed'), 100 + i * 90);
      });
    };

    const initReveal = () => {
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => el.classList.add('revealed'));
        heroSection.querySelectorAll<HTMLElement>('.img-reveal').forEach((el) => el.classList.add('revealed'));
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
      );

      document.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => {
        if (!heroSection || !heroSection.contains(el)) observer.observe(el);
      });

      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              imageObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      document.querySelectorAll<HTMLElement>('.img-reveal').forEach((el) => {
        if (!heroSection || !heroSection.contains(el)) imageObserver.observe(el);
      });
    };

    const initCounters = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || counted.has(entry.target)) return;

            counted.add(entry.target);
            const el = entry.target as HTMLElement;
            const target = Number.parseInt(el.dataset.count ?? '', 10);
            const suffix = el.dataset.suffix ?? '';
            if (Number.isNaN(target)) return;

            const duration = 1800;
            const start = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - (1 - progress) ** 3;
              el.textContent = `${Math.floor(target * ease).toLocaleString()}${suffix}`;
              if (progress < 1) window.requestAnimationFrame(tick);
              else el.textContent = `${target.toLocaleString()}${suffix}`;
            };

            window.requestAnimationFrame(tick);
          });
        },
        { threshold: 0.5 },
      );

      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => observer.observe(el));
    };

    initLines();
    initReveal();
    initCounters();
  }, []);

  return null;
}
