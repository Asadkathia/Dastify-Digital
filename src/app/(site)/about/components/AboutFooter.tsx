import Link from "next/link";

export type AboutFooterData = {
  brand: { name: string; accent: string; tagline: string };
  columns: { title: string; links: { label: string; href: string; highlight?: boolean }[] }[];
  copyright: string;
  legalLinks: { label: string; href: string }[];
};

export default function AboutFooter({ data }: { data: AboutFooterData }) {
  return (
    <footer className="about-footer">
      <div className="wrap">
        <div className="about-footer-top">
          <div className="about-footer-grid">
            <div className="about-footer-brand">
              <div className="about-footer-logo">
                {data.brand.name}
                <span>{data.brand.accent}</span>
              </div>
              <p className="about-footer-tagline">{data.brand.tagline}</p>
            </div>
            {data.columns.map((col, index) => (
              <div className="about-footer-col" key={`about-footer-col-${col.title}-${index}`}>
                <div className="about-footer-col-title">{col.title}</div>
                <ul className="about-footer-links">
                  {col.links.map((link, linkIndex) => (
                    <li key={`about-footer-link-${link.href ?? link.label}-${linkIndex}`}>
                      <Link href={link.href} className={`about-footer-link${link.highlight ? " about-footer-cta" : ""}`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="about-footer-bottom">
            <div className="about-footer-copy">{data.copyright}</div>
            <div className="about-footer-legal">
              {data.legalLinks.map((item, index) => (
                <Link href={item.href} key={`about-footer-legal-${item.href ?? item.label}-${index}`}>
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
