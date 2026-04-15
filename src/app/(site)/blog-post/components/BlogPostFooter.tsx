import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["footer"] };

export default function BlogPostFooter({ data }: Props) {
  return (
    <footer className="blog-post-footer footer">
      <div className="wrap">
        <div className="blog-post-footer-grid footer-grid">
          <div>
            <div className="footer-brand-name" data-field="footer.brand.name">
              {data.brand.name}
              <span data-field="footer.brand.dot">{data.brand.dot}</span>
              {data.brand.suffix}
            </div>
            <p className="footer-brand-desc" data-field="footer.brand.description">{data.brand.description}</p>
            <div className="footer-social">
              {data.brand.social.map((item, index) => (
                <Link key={`footer-social-${item.href}-${index}`} href={item.href} data-field={`footer.brand.social.${index}.label`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {data.columns.map((col, index) => (
            <div key={`footer-col-${col.title}-${index}`}>
              <div className="footer-col-title" data-field={`footer.columns.${index}.title`}>{col.title}</div>
              {col.links.map((item, linkIndex) => (
                <Link
                  key={`footer-link-${item.href}-${linkIndex}`}
                  href={item.href}
                  className={`footer-link${item.highlight ? " blog-post-footer-link-highlight" : ""}`}
                  data-field={`footer.columns.${index}.links.${linkIndex}.label`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-copy" data-field="footer.bottom.copy">{data.bottom.copy}</div>
          <div className="footer-badges">
            {data.bottom.badges.map((item, index) => (
              <span key={`footer-badge-${item}-${index}`} className="footer-badge" data-field={`footer.bottom.badges.${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
