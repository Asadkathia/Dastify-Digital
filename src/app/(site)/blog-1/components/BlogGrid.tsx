import Image from "next/image";
import Link from "next/link";
import type { PageContent } from "../content";
import type { SectionCard } from "@/lib/converted-pages/section-types";

type Props = {
  data: PageContent["grid"];
  /**
   * Optional server-fetched cards to render instead of the static posts[] array.
   * When present, sectionType is effectively non-static and this component
   * renders cards read-only (no data-field attributes for editing).
   * The page.tsx (or the Pages-collection dispatcher) is responsible for
   * deciding whether to fetch + pass cards — this component does NOT fetch.
   * Keeping the fetch out of here is mandatory: this file is imported by
   * editor-registry which is reached from the browser bundle, so it must not
   * touch server-only code (e.g. the Payload client).
   */
  cards?: SectionCard[];
};

export default function BlogGrid({ data, cards }: Props) {
  const TitleTag = data.titleTag || "h2";
  const useDynamic = Array.isArray(cards);

  const resolvedCards: SectionCard[] = useDynamic
    ? cards
    : data.posts.map((item, index) => ({
        href: item.href,
        category: item.category,
        date: item.date,
        title: item.title,
        excerpt: item.excerpt,
        linkLabel: item.linkLabel,
        image: item.image,
        imageAlt: item.imageAlt,
        editable: true,
        staticIndex: index,
      }));

  const placeholder = data.posts[0];

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
          {resolvedCards.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b", padding: "40px 0" }}>
              {useDynamic
                ? "No items found — publish something in the CMS or check your filter."
                : "No posts configured."}
            </p>
          ) : (
            resolvedCards.map((item, index) => {
              const fieldPrefix = item.editable ? `grid.posts.${item.staticIndex}` : undefined;
              const placeholderStyle = item.editable ? data.posts[item.staticIndex] : placeholder;
              return (
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
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        data-field={fieldPrefix ? `${fieldPrefix}.image` : undefined}
                      />
                    ) : placeholderStyle ? (
                      <div
                        className="iph blog1-iph-zero"
                        style={{
                          aspectRatio: placeholderStyle.placeholderDimensionsRatio || "16 / 10",
                          background: placeholderStyle.placeholderBackground,
                          borderColor: placeholderStyle.placeholderBorderColor,
                          borderWidth: placeholderStyle.placeholderBorderWidth,
                          borderStyle: placeholderStyle.placeholderBorderStyle as "dashed",
                          padding: placeholderStyle.placeholderPadding,
                          gap: placeholderStyle.placeholderGap,
                          borderRadius: placeholderStyle.placeholderRadius,
                        }}
                        data-field={fieldPrefix ? `${fieldPrefix}.image` : undefined}
                      >
                        <div className="iph-ic" data-field={fieldPrefix ? `${fieldPrefix}.placeholderIcon` : undefined}>{placeholderStyle.placeholderIcon}</div>
                        <div className="iph-lbl" data-field={fieldPrefix ? `${fieldPrefix}.placeholderLabel` : undefined}>{placeholderStyle.placeholderLabel}</div>
                        <div className="iph-dim" data-field={fieldPrefix ? `${fieldPrefix}.placeholderDimensions` : undefined}>{placeholderStyle.placeholderDimensions}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="blog1-blog-card-body">
                    <div className="blog1-blog-card-meta">
                      <span className="blog1-blog-card-cat" data-field={fieldPrefix ? `${fieldPrefix}.category` : undefined}>
                        {item.category}
                      </span>
                      <span className="blog1-blog-card-date" data-field={fieldPrefix ? `${fieldPrefix}.date` : undefined}>
                        {item.date}
                      </span>
                    </div>
                    <h3 className="blog1-blog-card-title" data-field={fieldPrefix ? `${fieldPrefix}.title` : undefined}>
                      {item.title}
                    </h3>
                    <p className="blog1-blog-card-excerpt" data-field={fieldPrefix ? `${fieldPrefix}.excerpt` : undefined}>
                      {item.excerpt}
                    </p>
                    <span className="blog1-blog-card-link" data-field={fieldPrefix ? `${fieldPrefix}.linkLabel` : undefined}>
                      {item.linkLabel}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
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
