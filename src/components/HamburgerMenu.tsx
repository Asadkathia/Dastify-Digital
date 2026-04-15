'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { NavigationData } from '@/lib/cms/queries';

type HamburgerMenuProps = {
  nav: NavigationData;
  activePath?: string;
};

export function HamburgerMenu({ nav, activePath }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only portal after mount (SSR guard)
  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // ESC key closes the menu
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isOpen]);

  const menu = (
    <div className={`mobile-menu${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div className="mobile-menu-backdrop" onClick={close} />

      {/* Slide-in panel from the left */}
      <nav className="mobile-menu-panel" aria-label="Mobile navigation">
        {/* Header row */}
        <div className="mobile-menu-header">
          <Link href={nav.logoHref || '/'} className="nav-logo" onClick={close}>
            <span>{nav.logoText}</span>
            <span style={{ color: 'var(--purple)' }}>{nav.logoAccent}</span>
          </Link>
          <button className="mobile-menu-close" aria-label="Close menu" onClick={close}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="17" y2="17" />
              <line x1="17" y1="3" x2="3" y2="17" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <ul className="mobile-menu-links">
          {nav.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`mobile-menu-link${activePath === link.href ? ' active' : ''}`}
                onClick={close}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href={nav.ctaHref || '/contact'} className="mobile-menu-cta" onClick={close}>
          {nav.ctaLabel}
        </Link>
      </nav>
    </div>
  );

  return (
    <>
      {/* Hamburger trigger — only visible on mobile via CSS */}
      <button
        className={`hamburger-btn${isOpen ? ' is-open' : ''}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Portal to body so it escapes the nav's stacking context */}
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
