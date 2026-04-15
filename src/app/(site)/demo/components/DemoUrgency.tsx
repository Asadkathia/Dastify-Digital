"use client";

import Link from "next/link";

type PageContent = import("./types").PageContent;

type UrgencyData = PageContent["urgency"];

export default function DemoUrgency({ data }: { data: UrgencyData }) {
  const TitleTag = (data.titleTag || "h2") as keyof JSX.IntrinsicElements;

  return (
    <section className="urgency-section">
      <div className="wrap">
        <div className="urgency-inner" data-r>
          <TitleTag
            className="urgency-title"
            data-field="urgency.title"
            data-style-field="urgency.editor.nodes.title.styles"
            data-tag-field="urgency.titleTag"
            data-allowed-tags="h2,h3"
          >
            {data.title}
          </TitleTag>
          <p
            className="urgency-sub"
            data-field="urgency.subtitle"
            data-style-field="urgency.editor.nodes.subtitle.styles"
          >
            {data.subtitle}
          </p>
          <div className="urgency-btns">
            <button
              className="btn-white"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              data-field="urgency.primaryCta.label"
              data-style-field="urgency.editor.nodes.primaryCta.styles"
            >
              {data.primaryCta.label}
            </button>
            <Link
              href={data.secondaryCta.href}
              className="btn-ghost-lt"
              data-field="urgency.secondaryCta.label"
              data-style-field="urgency.editor.nodes.secondaryCta.styles"
            >
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
