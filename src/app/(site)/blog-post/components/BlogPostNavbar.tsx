import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["nav"] };

export default function BlogPostNavbar({ data }: Props) {
  return (
    <nav className="nav" id="nav">
      <Link
        href={data.logo.href}
        className="nav-logo"
        data-field="nav.logo.text"
      >
        {data.logo.text}
        <span data-field="nav.logo.dot">{data.logo.dot}</span>
      </Link>
      <div className="blog-post-nav-links">
        {data.links.map((item, index) => {
          const isInternal = item.href.startsWith("/");
          const className = `nav-link${item.active ? " active" : ""}`;
          return isInternal ? (
            <Link
              key={`nav-${item.href ?? item.label}-${index}`}
              href={item.href}
              className={className}
              data-field={`nav.links.${index}.label`}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={`nav-${item.href ?? item.label}-${index}`}
              href={item.href}
              className={className}
              data-field={`nav.links.${index}.label`}
            >
              {item.label}
            </a>
          );
        })}
        <Link
          href={data.cta.href}
          className="btn-dk nav-cta"
          data-field="nav.cta.label"
        >
          {data.cta.label}
        </Link>
      </div>
    </nav>
  );
}
