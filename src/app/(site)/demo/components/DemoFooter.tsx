import Link from "next/link";

type PageContent = import("./types").PageContent;

type FooterData = PageContent["footer"];

export default function DemoFooter({ data }: { data: FooterData }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div
              className="footer-brand-name"
              data-field="footer.brandName"
              data-style-field="footer.editor.nodes.brandName.styles"
            >
              {data.brandName}
              <span data-field="footer.brandDot">{data.brandDot}</span>
            </div>
            <p
              className="footer-brand-desc"
              data-field="footer.brandDescription"
              data-style-field="footer.editor.nodes.brandDescription.styles"
            >
              {data.brandDescription}
            </p>
            <div className="footer-social">
              {data.socialLinks.map((item, index) => (
                <Link
                  href={item.href}
                  key={`${"footer-social"}-${item.href ?? item.label}-${index}`}
                  data-field={`footer.socialLinks.${index}.label`}
                  data-style-field={`footer.editor.nodes.social_${index}.styles`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {data.columns.map((col, colIndex) => (
            <div key={`${"footer-columns"}-${col.title}-${colIndex}`}>
              <div
                className="footer-col-title"
                data-field={`footer.columns.${colIndex}.title`}
                data-style-field={`footer.editor.nodes.columnTitle_${colIndex}.styles`}
              >
                {col.title}
              </div>
              {col.links.map((link, linkIndex) => (
                <Link
                  href={link.href}
                  className={`footer-link ${link.emphasis ? "demo-footer-link-emphasis" : ""}`.trim()}
                  key={`${"footer-links"}-${link.href ?? link.label}-${linkIndex}`}
                  data-field={`footer.columns.${colIndex}.links.${linkIndex}.label`}
                  data-style-field={`footer.editor.nodes.columnLink_${colIndex}_${linkIndex}.styles`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div
            className="footer-copy"
            data-field="footer.copy"
            data-style-field="footer.editor.nodes.copy.styles"
          >
            {data.copy}
          </div>
          <div className="footer-badges">
            {data.badges.map((item, index) => (
              <span
                className="footer-badge"
                key={`${"footer-badges"}-${item}-${index}`}
                data-field={`footer.badges.${index}`}
                data-style-field={`footer.editor.nodes.badge_${index}.styles`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
