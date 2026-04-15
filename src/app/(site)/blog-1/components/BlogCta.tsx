import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["cta"] };

export default function BlogCta({ data }: Props) {
  const TitleTag = data.titleTag || "h2";

  return (
    <section className="blog1-cta-section">
      <div className="wrap">
        <div className="blog1-cta-inner" data-r>
          <TitleTag
            className="blog1-cta-title"
            data-field="cta.title"
            data-style-field="cta.editor.nodes.title.styles"
            data-tag-field="cta.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <p className="blog1-cta-sub" data-field="cta.subtitle">{data.subtitle}</p>
          <div className="blog1-cta-btns">
            <Link href={data.primary.href} className="blog1-btn-white" data-field="cta.primary.label">
              {data.primary.label}
            </Link>
            <Link href={data.secondary.href} className="blog1-btn-ghost-lt" data-field="cta.secondary.label">
              {data.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
