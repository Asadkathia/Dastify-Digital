import Link from "next/link";
import { getConvertedNodeBinding } from "@/components/converted-editor";

type NavData = {
  logoText: string;
  logoAccent: string;
  links: { label: string; href: string; active?: boolean }[];
  ctaLabel: string;
  ctaHref: string;
};

export default function Navbar({ data }: { data: NavData }) {
  const links = Array.isArray(data.links) ? data.links : [];
  const logoTextNode = getConvertedNodeBinding(data, { field: 'logoText', defaultTag: 'a' });
  const logoAccentNode = getConvertedNodeBinding(data, { field: 'logoAccent', defaultTag: 'span' });
  const ctaNode = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'a', nodeKey: 'ctaLabel' });
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="nav-logo" {...logoTextNode.props}>
        <span>{data.logoText}</span>
        <span {...logoAccentNode.props}>{data.logoAccent}</span>
      </Link>
      <ul className="svc-convert-nav-links">
        {links.map((link, index) => {
          const linkNode = getConvertedNodeBinding(data, {
            field: `links.${index}.label`,
            defaultTag: 'a',
            nodeKey: `links_${index}_label`,
          });
          const href = typeof link.href === "string" && link.href.length > 0 ? link.href : "#";
          return (
          <li key={`${href}-${index}`}>
            <Link href={href} className={`nav-link${link.active ? " active" : ""}`} {...linkNode.props}>
              {link.label}
            </Link>
          </li>
          );
        })}
      </ul>
      <Link href={typeof data.ctaHref === "string" && data.ctaHref.length > 0 ? data.ctaHref : "#"} className="nav-cta svc-convert-btn-nav" {...ctaNode.props}>
        {data.ctaLabel}
      </Link>
    </nav>
  );
}
