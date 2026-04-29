import Link from 'next/link';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import type { NavigationData } from '@/lib/cms/queries';

type SiteNavbarProps = {
  nav: NavigationData;
  /** Pathname of the current page — used to mark the active link */
  activePath?: string;
  /** Extra classes added to the <nav> element (e.g. "about-nav") */
  navClassName?: string;
  /** Class added to <nav> when scrolled (default: "scrolled") */
  scrolledClass?: string;
  /** Class for the link list element (e.g. "nav-links", "about-nav-links") */
  linkListClassName?: string;
  /** Class for the CTA button (e.g. "about-btn-nav", "btn-dk nav-cta") */
  ctaClassName?: string;
};

export function SiteNavbar({
  nav,
  activePath,
  navClassName,
  scrolledClass = 'scrolled',
  linkListClassName = 'nav-links',
  ctaClassName = 'btn-dk nav-cta',
}: SiteNavbarProps) {
  return (
    <>
      <NavbarScrollState selector=".nav" solidClass={scrolledClass} offset={80} />
      <nav className={`nav${navClassName ? ` ${navClassName}` : ''}`} id="nav">
        <Link href={nav.logoHref || '/'} className="nav-logo">
          {nav.logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={nav.logoImage} alt={nav.logoText} className="nav-logo-img" />
          ) : (
            <>
              <span>{nav.logoText}</span>
              <span style={{ color: 'var(--purple, #7c3aed)' }}>{nav.logoAccent}</span>
            </>
          )}
        </Link>
        <ul className={linkListClassName} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {nav.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-link${activePath === link.href ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={nav.ctaHref || '/contact'} className={ctaClassName}>
          {nav.ctaLabel}
        </Link>
        <HamburgerMenu nav={nav} activePath={activePath} />
      </nav>
    </>
  );
}
