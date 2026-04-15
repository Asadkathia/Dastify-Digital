import Link from "next/link";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["nav"];
};

export default function ContactNavbar({ data }: Props) {
  return (
    <nav className="nav" id="nav">
      <Link href={data.logoHref} className="nav-logo" data-field="nav.logoText">
        {data.logoTextPrimary}
        <span data-field="nav.logoTextAccent">{data.logoTextAccent}</span>
        {data.logoTextSecondary}
      </Link>

      <div className="contact2-nav-links">
        {data.links.map((item, index) => {
          const isInternal = item.href.startsWith("/");
          const className = `nav-link${item.active ? " active" : ""}`;
          return isInternal ? (
            <Link
              key={`${"nav-links"}-${item.href ?? item.label}-${index}`}
              href={item.href}
              className={className}
              data-field={`nav.links.${index}.label`}
            >
              {item.label}
            </Link>
          ) : (
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
