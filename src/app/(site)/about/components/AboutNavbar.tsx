import Link from "next/link";
import { NavbarScrollState } from "@/app/components/home/NavbarScrollState";

export type AboutNavbarData = {
  logo: { text: string; accent: string; href: string };
  links: { label: string; href: string; active?: boolean }[];
  cta: { label: string; href: string };
};

export default function AboutNavbar({ data }: { data: AboutNavbarData }) {
  return (
    <>
      <NavbarScrollState selector=".nav" solidClass="scrolled" offset={80} />
      <nav className="nav about-nav" id="nav">
        <Link href={data.logo.href} className="nav-logo">
          {data.logo.text}
          <span>{data.logo.accent}</span>
        </Link>
        <ul className="about-nav-links">
          {data.links.map((item, index) => (
            <li key={`about-nav-${item.href ?? item.label}-${index}`}>
              <Link href={item.href} className={`nav-link${item.active ? " active" : ""}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={data.cta.href} className="about-btn-nav">
          {data.cta.label}
        </Link>
      </nav>
    </>
  );
}
