'use client';

import { useEffect } from 'react';

export function NavbarScrollState() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('solid', window.scrollY > 60);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
