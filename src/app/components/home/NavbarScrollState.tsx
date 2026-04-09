'use client';

import { useEffect } from 'react';

type NavbarScrollStateProps = {
  selector?: string;
  solidClass?: string;
  offset?: number;
};

export function NavbarScrollState({
  selector,
  solidClass = 'solid',
  offset = 60,
}: NavbarScrollStateProps = {}) {
  useEffect(() => {
    const nav = selector
      ? document.querySelector(selector)
      : document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle(solidClass, window.scrollY > offset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [selector, solidClass, offset]);

  return null;
}
