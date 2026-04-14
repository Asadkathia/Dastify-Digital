import Link from "next/link";
import { getConvertedNodeBinding } from "@/components/converted-editor";

type FooterData = {
  logoText: string;
  logoAccent: string;
  tagline: string;
  columns: {
    title: string;
    links: { label: string; href: string }[];
  }[];
  copyright: string;
  legalLinks: { label: string; href: string }[];
};

export default function Footer({ data }: { data: FooterData }) {
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const legalLinks = Array.isArray(data.legalLinks) ? data.legalLinks : [];
  const logoTextNode = getConvertedNodeBinding(data, { field: 'logoText', defaultTag: 'div', nodeKey: 'logoText' });
  const logoAccentNode = getConvertedNodeBinding(data, { field: 'logoAccent', defaultTag: 'span', nodeKey: 'logoAccent' });
  const taglineNode = getConvertedNodeBinding(data, { field: 'tagline', defaultTag: 'p', nodeKey: 'tagline' });
  return (
    <footer className="svc-convert-footer">
      <div className="wrap">
        <div className="svc-convert-footer-top">
          <div className="svc-convert-footer-grid">
            <div>
              <div className="svc-convert-footer-logo" {...logoTextNode.props}>
                <span>{data.logoText}</span>
                <span {...logoAccentNode.props}>{data.logoAccent}</span>
              </div>
              <p className="svc-convert-footer-tagline" {...taglineNode.props}>{data.tagline}</p>
            </div>
            {columns.map((column, columnIndex) => (
              <div key={column.title}>
                <div className="svc-convert-footer-col-title" {...getConvertedNodeBinding(data, { field: `columns.${columnIndex}.title`, defaultTag: 'div', nodeKey: `columns_${columnIndex}_title` }).props}>{column.title}</div>
                <ul className="svc-convert-footer-links">
                  {(Array.isArray(column.links) ? column.links : []).map((link, index) => (
                    <li key={`${column.title}-${link.href ?? index}-${index}`}>
                      <Link href={typeof link.href === "string" && link.href.length > 0 ? link.href : "#"} className={`svc-convert-footer-link${column.title === "Contact" && index === 0 ? " svc-convert-footer-cta" : ""}`} {...getConvertedNodeBinding(data, { field: `columns.${columnIndex}.links.${index}.label`, defaultTag: 'a', nodeKey: `columns_${columnIndex}_links_${index}_label` }).props}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="svc-convert-footer-bottom">
            <div className="svc-convert-footer-copy" {...getConvertedNodeBinding(data, { field: 'copyright', defaultTag: 'div', nodeKey: 'copyright' }).props}>{data.copyright}</div>
            <div className="svc-convert-footer-legal">
              {legalLinks.map((link, index) => (
                <Link key={`${link.href ?? index}-${index}`} href={typeof link.href === "string" && link.href.length > 0 ? link.href : "#"} {...getConvertedNodeBinding(data, { field: `legalLinks.${index}.label`, defaultTag: 'a', nodeKey: `legalLinks_${index}_label` }).props}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
