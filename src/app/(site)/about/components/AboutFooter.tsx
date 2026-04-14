import Link from "next/link";
import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutFooterData = {
  brand: { name: string; accent: string; tagline: string };
  columns: { title: string; links: { label: string; href: string; highlight?: boolean }[] }[];
  copyright: string;
  legalLinks: { label: string; href: string }[];
};

export default function AboutFooter({ data }: { data: AboutFooterData }) {
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const legalLinks = Array.isArray(data.legalLinks) ? data.legalLinks : [];
  return (
    <footer className="about-footer">
      <div className="wrap">
        <div className="about-footer-top">
          <div className="about-footer-grid">
            <div className="about-footer-brand">
              <div className="about-footer-logo" {...getConvertedNodeBinding(data, { field: 'brand.name', defaultTag: 'div', nodeKey: 'brand_name' }).props}>
                <span>{data.brand.name}</span>
                <span {...getConvertedNodeBinding(data, { field: 'brand.accent', defaultTag: 'span', nodeKey: 'brand_accent' }).props}>{data.brand.accent}</span>
              </div>
              <p className="about-footer-tagline" {...getConvertedNodeBinding(data, { field: 'brand.tagline', defaultTag: 'p', nodeKey: 'brand_tagline' }).props}>{data.brand.tagline}</p>
            </div>
            {columns.map((col, index) => (
              <div className="about-footer-col" key={`about-footer-col-${col.title}-${index}`}>
                <div className="about-footer-col-title" {...getConvertedNodeBinding(data, { field: `columns.${index}.title`, defaultTag: 'div', nodeKey: `columns_${index}_title` }).props}>{col.title}</div>
                <ul className="about-footer-links">
                  {(Array.isArray(col.links) ? col.links : []).map((link, linkIndex) => (
                    <li key={`about-footer-link-${link.href ?? link.label}-${linkIndex}`}>
                      <Link href={typeof link.href === "string" && link.href.length > 0 ? link.href : "#"} className={`about-footer-link${link.highlight ? " about-footer-cta" : ""}`} {...getConvertedNodeBinding(data, { field: `columns.${index}.links.${linkIndex}.label`, defaultTag: 'a', nodeKey: `columns_${index}_links_${linkIndex}_label` }).props}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="about-footer-bottom">
            <div className="about-footer-copy" {...getConvertedNodeBinding(data, { field: 'copyright', defaultTag: 'div', nodeKey: 'copyright' }).props}>{data.copyright}</div>
            <div className="about-footer-legal">
              {legalLinks.map((item, index) => (
                <Link href={typeof item.href === "string" && item.href.length > 0 ? item.href : "#"} key={`about-footer-legal-${item.href ?? item.label}-${index}`} {...getConvertedNodeBinding(data, { field: `legalLinks.${index}.label`, defaultTag: 'a', nodeKey: `legalLinks_${index}_label` }).props}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
