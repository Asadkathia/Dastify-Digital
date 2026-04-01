import type { HomepageContent } from '@/lib/homepage-content';

type NavbarProps = {
  data: HomepageContent['nav'];
};

export function Navbar({ data }: NavbarProps) {
  const [brandLeft, brandRight] = data.logo.split('.');

  return (
    <nav className="nav" id="nav">
      <div className="nav-logo">
        {brandLeft}
        <span className="nav-logo-dot">.</span>
        {brandRight}
      </div>
      <div className="nav-links">
        {data.links.map((link) => (
          <a key={link.label} className="nav-link" href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <button className="btn-dk nav-cta" type="button">
        {data.cta}
      </button>
    </nav>
  );
}
