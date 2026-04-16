import Image from "next/image";
import type { PageContent } from "../content";

type Props = { data: PageContent["featured"] };

export default function FeaturedPost({ data }: Props) {
  const TitleTag = data.titleTag || "h2";

  return (
    <section className="blog1-featured-section">
      <div className="wrap">
        <div className="blog1-featured-label" data-r data-field="featured.label">
          {data.label}
        </div>
        <div className="blog1-featured-grid">
          <div className="blog1-featured-img" data-r="L">
            {data.image ? (
              <div className="blog1-featured-image-frame">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  width={640}
                  height={400}
                  className="blog1-media-img"
                  style={{ objectFit: (data.imageFit || "cover") as React.CSSProperties['objectFit'], objectPosition: data.imagePosition || "center", borderRadius: data.imageRadius || "4px" }}
                  data-field="featured.image"
                />
              </div>
            ) : (
              <div
                className="iph blog1-iph-fixed"
                style={{
                  aspectRatio: data.placeholderDimensionsRatio || "16 / 10",
                  background: data.placeholderBackground,
                  borderColor: data.placeholderBorderColor,
                  borderWidth: data.placeholderBorderWidth,
                  borderStyle: data.placeholderBorderStyle as "dashed",
                  padding: data.placeholderPadding,
                  gap: data.placeholderGap,
                  borderRadius: data.placeholderRadius,
                }}
                data-field="featured.image"
              >
                <div className="iph-ic" data-field="featured.placeholderIcon">{data.placeholderIcon}</div>
                <div className="iph-lbl" data-field="featured.placeholderLabel">{data.placeholderLabel}</div>
                <div className="iph-dim" data-field="featured.placeholderDimensions">{data.placeholderDimensions}</div>
              </div>
            )}
          </div>
          <div className="blog1-featured-content" data-r="R">
            <div className="blog1-featured-cats">
              {data.categories.map((item, index) => (
                <span
                  key={`${"featured-cats"}-${item.label}-${index}`}
                  className={`blog1-featured-cat${item.variant === "blue" ? " blue" : ""}`}
                  data-field={`featured.categories.${index}.label`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <div className="blog1-featured-date" data-field="featured.date">{data.date}</div>
            <TitleTag
              className="blog1-featured-title"
              data-field="featured.title"
              data-style-field="featured.editor.nodes.title.styles"
              data-tag-field="featured.titleTag"
              data-allowed-tags="h2,h3,h4"
            >
              {data.title}
            </TitleTag>
            <p className="blog1-featured-excerpt" data-field="featured.excerpt">{data.excerpt}</p>
            <div className="blog1-featured-author">
              <div className="blog1-featured-author-avatar" data-field="featured.author.avatar">{data.author.avatar}</div>
              <div>
                <div className="blog1-featured-author-name" data-field="featured.author.name">{data.author.name}</div>
                <div className="blog1-featured-author-role" data-field="featured.author.role">{data.author.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
