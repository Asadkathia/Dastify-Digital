import Link from "next/link";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["footer"];
};

export default function ContactFooter({ data }: Props) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name" data-field="footer.brand.namePrimary">
              {data.brand.namePrimary}
              <span data-field="footer.brand.nameAccent">{data.brand.nameAccent}</span>
              {data.brand.nameSecondary}
            </div>
            <p className="footer-brand-desc" data-field="footer.brand.description">
              {data.brand.description}
            </p>
            <div className="footer-social">
              {data.brand.social.map((item, index) => (
                <a
                  href={item.href}
                  key={`${"footer-social"}-${item.href ?? item.label}-${index}`}
                  data-field={`footer.brand.social.${index}.label`}
                  aria-label={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {data.columns.map((column, columnIndex) => (
            <div key={`${"footer-columns"}-${column.title}-${columnIndex}`}>
              <div className="footer-col-title" data-field={`footer.columns.${columnIndex}.title`}>
                {column.title}
              </div>
              {column.links.map((item, linkIndex) => {
                const isInternal = item.href.startsWith("/");
                const className = `footer-link${item.highlight ? " contact2-footer-link-highlight" : ""}`;
                return isInternal ? (
                  <Link
                    href={item.href}
                    className={className}
                    key={`${"footer-links"}-${item.href ?? item.label}-${linkIndex}`}
                    data-field={`footer.columns.${columnIndex}.links.${linkIndex}.label`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={className}
                    key={`${"footer-links"}-${item.href ?? item.label}-${linkIndex}`}
                    data-field={`footer.columns.${columnIndex}.links.${linkIndex}.label`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-copy" data-field="footer.copy">
            {data.copy}
          </div>
          <div className="footer-badges">
            {data.badges.map((item, index) => (
              <span className="footer-badge" key={`${"footer-badges"}-${item}-${index}`} data-field={`footer.badges.${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
