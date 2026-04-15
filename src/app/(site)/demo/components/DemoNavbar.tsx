"use client";

import Link from "next/link";

type NavData = PageContent["nav"];

type PageContent = import("./types").PageContent;

export default function DemoNavbar({ data }: { data: NavData }) {
  return (
    <nav className="nav" id="nav">
      <Link
        href={data.logoHref}
        className="nav-logo"
        data-field="nav.logoText"
        data-style-field="nav.editor.nodes.logoText.styles"
      >
        {data.logoText}
        <span className="nav-logo-dot" data-field="nav.logoDot">{data.logoDot}</span>
      </Link>
      <div className="demo-nav-links">
        {data.links.map((item, index) => (
          <Link
            key={`${"nav-links"}-${item.href ?? item.label}-${index}`}
            href={item.href}
            className="nav-link"
            data-field={`nav.links.${index}.label`}
            data-style-field={`nav.editor.nodes.links_${index}.styles`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={data.cta.href}
          className="btn-dk nav-cta"
          data-field="nav.cta.label"
          data-style-field="nav.editor.nodes.cta.styles"
        >
          {data.cta.label}
        </Link>
      </div>
    </nav>
  );
}
