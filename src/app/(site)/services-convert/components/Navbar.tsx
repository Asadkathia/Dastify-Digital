import Link from "next/link";

type NavData = {
  logoText: string;
  logoAccent: string;
  links: { label: string; href: string; active?: boolean }[];
  ctaLabel: string;
  ctaHref: string;
};

export default function Navbar({ data }: { data: NavData }) {
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="nav-logo">
        {data.logoText}
        <span>{data.logoAccent}</span>
      </Link>
      <ul className="svc-convert-nav-links">
        {data.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`nav-link${link.active ? " active" : ""}`}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={data.ctaHref} className="nav-cta svc-convert-btn-nav">
        {data.ctaLabel}
      </Link>
    </nav>
  );
}
