import Image from "next/image";
import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["grid"] };

export default function BlogGrid({ data }: Props) {
  const TitleTag = data.titleTag || "h2";

  return (
    <section className="blog1-blog-grid-section">
      <span className="sec-wm g2" data-field="grid.watermark">{data.watermark}</span>
      <div className="wrap">
        <div className="blog1-blog-grid-header" data-r>
          <TitleTag
            className="blog1-blog-grid-title"
            data-field="grid.title"
            data-style-field="grid.editor.nodes.title.styles"
            data-tag-field="grid.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <Link href={data.viewAll.href} className="btn-ol" data-field="grid.viewAll.label">
            {data.viewAll.label}
          </Link>
        </div>

        <div className="blog1-blog-grid">
          {data.posts.map((item, index) => (
            <Link
              href={item.href}
              className="blog1-blog-card"
              data-r
              data-delay={String((index % 3) + 1)}
              key={`${"grid-posts"}-${item.href ?? item.title}-${index}`}
            >
              <div className="blog1-blog-card-img">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={480}
                    height={300}
                    className="blog1-media-img"
                    style={{ objectFit: item.imageFit || "cover", objectPosition: item.imagePosition || "center", borderRadius: item.imageRadius || "0px" }}
                    data-field={`grid.posts.${index}.image`}
                  />
                ) : (
                  <div
                    className="iph blog1-iph-zero"
                    style={{
                      aspectRatio: item.placeholderDimensionsRatio || "16 / 10",
                      background: item.placeholderBackground,
                      borderColor: item.placeholderBorderColor,
                      borderWidth: item.placeholderBorderWidth,
                      borderStyle: item.placeholderBorderStyle as "dashed",
                      padding: item.placeholderPadding,
                      gap: item.placeholderGap,
                      borderRadius: item.placeholderRadius,
                    }}
                    data-field={`grid.posts.${index}.image`}
                  >
                    <div className="iph-ic" data-field={`grid.posts.${index}.placeholderIcon`}>{item.placeholderIcon}</div>
                    <div className="iph-lbl" data-field={`grid.posts.${index}.placeholderLabel`}>{item.placeholderLabel}</div>
                    <div className="iph-dim" data-field={`grid.posts.${index}.placeholderDimensions`}>{item.placeholderDimensions}</div>
                  </div>
                )}
              </div>
              <div className="blog1-blog-card-body">
                <div className="blog1-blog-card-meta">
                  <span className="blog1-blog-card-cat" data-field={`grid.posts.${index}.category`}>
                    {item.category}
                  </span>
                  <span className="blog1-blog-card-date" data-field={`grid.posts.${index}.date`}>
                    {item.date}
                  </span>
                </div>
                <h3 className="blog1-blog-card-title" data-field={`grid.posts.${index}.title`}>
                  {item.title}
                </h3>
                <p className="blog1-blog-card-excerpt" data-field={`grid.posts.${index}.excerpt`}>
                  {item.excerpt}
                </p>
                <span className="blog1-blog-card-link" data-field={`grid.posts.${index}.linkLabel`}>
                  {item.linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="blog1-pagination" data-r>
          {data.pagination.map((item, index) => (
            <button
              key={`${"pagination"}-${item.label}-${index}`}
              className={`blog1-page-btn${item.active ? " active" : ""}${item.isArrow ? " arrow" : ""}`}
              type="button"
              data-field={`grid.pagination.${index}.label`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
