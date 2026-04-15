import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["footer"] };

export default function BlogFooter({ data }: Props) {
  return (
    <footer className="blog1-footer">
      <div className="wrap">
        <div className="blog1-footer-grid">
          <div>
            <div className="blog1-footer-brand-name" data-field="footer.brand.name">
              {data.brand.namePrefix}
              <span data-field="footer.brand.accent">{data.brand.accent}</span>
              {data.brand.nameSuffix}
            </div>
            <p className="blog1-footer-brand-desc" data-field="footer.brand.description">{data.brand.description}</p>
            <div className="blog1-footer-social">
              {data.brand.social.map((item, index) => (
                <a key={`${"footer-social"}-${item.href ?? item.label}-${index}`} href={item.href} data-field={`footer.brand.social.${index}.label`}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          {data.columns.map((column, columnIndex) => (
            <div key={`${"footer-columns"}-${column.title}-${columnIndex}`}>
              <div className="blog1-footer-col-title" data-field={`footer.columns.${columnIndex}.title`}>
                {column.title}
              </div>
              {column.links.map((item, linkIndex) => {
                const isInternal = item.href.startsWith("/");
                const isEmail = item.href.startsWith("mailto:");
                const isTel = item.href.startsWith("tel:");
                const className = `blog1-footer-link${item.highlight ? " blog1-footer-link-highlight" : ""}`;
                if (isInternal) {
                  return (
                    <Link key={`${"footer-links"}-${item.href ?? item.label}-${linkIndex}`} href={item.href} className={className} data-field={`footer.columns.${columnIndex}.links.${linkIndex}.label`}>
                      {item.label}
                    </Link>
                  );
                }
                if (isEmail || isTel || item.href.startsWith("#") || item.href.startsWith("http")) {
                  return (
                    <a key={`${"footer-links"}-${item.href ?? item.label}-${linkIndex}`} href={item.href} className={className} data-field={`footer.columns.${columnIndex}.links.${linkIndex}.label`}>
                      {item.label}
                    </a>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
        <div className="blog1-footer-bottom">
          <div className="blog1-footer-copy" data-field="footer.copy">{data.copy}</div>
          <div className="blog1-footer-badges">
            {data.badges.map((item, index) => (
              <span className="blog1-footer-badge" key={`${"footer-badges"}-${item}-${index}`} data-field={`footer.badges.${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
