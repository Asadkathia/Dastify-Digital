import Link from "next/link";
import { NavbarScrollState } from "@/app/components/home/NavbarScrollState";
import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutNavbarData = {
  logo: { text: string; accent: string; href: string };
  links: { label: string; href: string; active?: boolean }[];
  cta: { label: string; href: string };
};

export default function AboutNavbar({ data }: { data: AboutNavbarData }) {
  const links = Array.isArray(data.links) ? data.links : [];
  const logoTextNode = getConvertedNodeBinding(data, { field: 'logo.text', defaultTag: 'a', nodeKey: 'logo_text' });
  const logoAccentNode = getConvertedNodeBinding(data, { field: 'logo.accent', defaultTag: 'span', nodeKey: 'logo_accent' });
  const ctaNode = getConvertedNodeBinding(data, { field: 'cta.label', defaultTag: 'a', nodeKey: 'cta_label' });
  return (
    <>
      <NavbarScrollState selector=".nav" solidClass="scrolled" offset={80} />
      <nav className="nav about-nav" id="nav">
        <Link href={typeof data.logo?.href === "string" && data.logo.href.length > 0 ? data.logo.href : "#"} className="nav-logo" {...logoTextNode.props}>
          <span>{data.logo.text}</span>
          <span {...logoAccentNode.props}>{data.logo.accent}</span>
        </Link>
        <ul className="about-nav-links">
          {links.map((item, index) => (
            <li key={`about-nav-${item.href ?? item.label}-${index}`}>
              <Link href={typeof item.href === "string" && item.href.length > 0 ? item.href : "#"} className={`nav-link${item.active ? " active" : ""}`} {...getConvertedNodeBinding(data, { field: `links.${index}.label`, defaultTag: 'a', nodeKey: `links_${index}_label` }).props}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={typeof data.cta?.href === "string" && data.cta.href.length > 0 ? data.cta.href : "#"} className="about-btn-nav" {...ctaNode.props}>
          {typeof data.cta?.label === "string" ? data.cta.label : ""}
        </Link>
      </nav>
    </>
  );
}
