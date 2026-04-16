import Link from "next/link";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["cta"];
};

export default function ContactCta({ data }: Props) {
  const TitleTag = (data.titleTag || "h2") as "h1" | "h2" | "h3" | "h4" | "p" | "span";

  return (
    <section className="cta-section">
      <div className="wrap">
        <div className="cta-inner" data-r>
          <TitleTag
            className="cta-title"
            data-field="cta.title"
            data-style-field="cta.editor.nodes.title.styles"
            data-tag-field="cta.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <p className="cta-sub" data-field="cta.subtitle">
            {data.subtitle}
          </p>
          <div className="cta-btns">
            <Link href={data.primaryCta.href} className="btn-white" data-field="cta.primaryCta.label">
              {data.primaryCta.label}
            </Link>
            <Link href={data.secondaryCta.href} className="btn-ghost-lt" data-field="cta.secondaryCta.label">
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
