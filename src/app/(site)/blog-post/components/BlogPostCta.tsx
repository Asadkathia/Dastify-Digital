import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["cta"] };

export default function BlogPostCta({ data }: Props) {
  const TitleTag = (data.titleTag || "h2") as "h2" | "h3" | "h4";

  return (
    <section className="blog-post-cta-section cta-section">
      <div className="wrap">
        <div className="blog-post-cta-inner cta-inner" data-r>
          <TitleTag
            className="blog-post-cta-title cta-title"
            data-field="cta.title"
            data-tag-field="cta.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <p className="cta-sub" data-field="cta.subtitle">{data.subtitle}</p>
          <div className="cta-btns">
            <Link href={data.primaryButton.href} className="btn-white" data-field="cta.primaryButton.label">{data.primaryButton.label}</Link>
            <Link href={data.secondaryButton.href} className="btn-ghost-lt" data-field="cta.secondaryButton.label">{data.secondaryButton.label}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
