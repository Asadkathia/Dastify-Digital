import Link from "next/link";

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
  return (
    <footer className="svc-convert-footer">
      <div className="wrap">
        <div className="svc-convert-footer-top">
          <div className="svc-convert-footer-grid">
            <div>
              <div className="svc-convert-footer-logo">
                {data.logoText}
                <span>{data.logoAccent}</span>
              </div>
              <p className="svc-convert-footer-tagline">{data.tagline}</p>
            </div>
            {data.columns.map((column) => (
              <div key={column.title}>
                <div className="svc-convert-footer-col-title">{column.title}</div>
                <ul className="svc-convert-footer-links">
                  {column.links.map((link, index) => (
                    <li key={`${column.title}-${link.href}-${index}`}>
                      <Link href={link.href} className={`svc-convert-footer-link${column.title === "Contact" && index === 0 ? " svc-convert-footer-cta" : ""}`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="svc-convert-footer-bottom">
            <div className="svc-convert-footer-copy">{data.copyright}</div>
            <div className="svc-convert-footer-legal">
              {data.legalLinks.map((link) => (
                <Link key={link.href} href={link.href}>
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
