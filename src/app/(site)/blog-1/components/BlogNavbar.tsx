import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["nav"] };

export default function BlogNavbar({ data }: Props) {
  return (
    <nav className="nav" id="nav">
      <Link
        href={data.logoHref}
        className="nav-logo"
        data-field="nav.logoText"
        data-style-field="nav.editor.nodes.logoText.styles"
      >
        {data.logoTextPrefix}
        <span data-field="nav.logoAccent">{data.logoAccent}</span>
        {data.logoTextSuffix}
      </Link>
      <div className="blog1-nav-links">
        {data.links.map((item, index) => {
          const isInternal = item.href.startsWith("/");
          const className = `nav-link${item.active ? " active" : ""}`;
          if (isInternal) {
            return (
              <Link
                key={`${"nav-links"}-${item.href ?? item.label}-${index}`}
                href={item.href}
                className={className}
                data-field={`nav.links.${index}.label`}
              >
                {item.label}
              </Link>
            );
          }
          return (
            <a
              key={`${"nav-links"}-${item.href ?? item.label}-${index}`}
              href={item.href}
              className={className}
              data-field={`nav.links.${index}.label`}
            >
              {item.label}
            </a>
          );
        })}
        <Link href={data.cta.href} className="btn-dk nav-cta" data-field="nav.cta.label">
          {data.cta.label}
        </Link>
      </div>
    </nav>
  );
}
