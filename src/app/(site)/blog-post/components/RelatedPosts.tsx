import Link from "next/link";
import Image from "next/image";
import type { PageContent } from "../content";

type Props = { data: PageContent["relatedPosts"] };

export default function RelatedPosts({ data }: Props) {
  const TitleTag = (data.titleTag || "h2") as "h2" | "h3" | "h4";

  return (
    <section className="blog-post-related-section related-section">
      <div className="wrap">
        <TitleTag
          className="blog-post-related-header related-header"
          data-r
          data-field="relatedPosts.title"
          data-tag-field="relatedPosts.titleTag"
          data-allowed-tags="h2,h3,h4"
        >
          {data.title}
        </TitleTag>
        <div className="blog-post-related-grid related-grid">
          {data.items.map((item, index) => (
            <Link key={`related-${item.href ?? item.title}-${index}`} href={item.href} className="blog-post-related-card related-card" data-r data-delay={`${index + 1}` as "1" | "2" | "3"}>
              <div className="related-card-img">
                {item.media.image ? (
                  <div className="blog-post-related-image-wrap">
                    <Image
                      src={item.media.image}
                      alt={item.media.imageAlt || ""}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: item.media.imageFit || "cover", objectPosition: item.media.imagePosition || "center" }}
                      data-field={`relatedPosts.items.${index}.media.image`}
                    />
                  </div>
                ) : (
                  <div className="iph blog-post-related-iph" style={{ aspectRatio: item.media.aspectRatio || "16/10", borderRadius: 0 as any }}>
                    <div className="iph-ic" data-field={`relatedPosts.items.${index}.media.placeholderIcon`}>{item.media.placeholderIcon}</div>
                    <div className="iph-lbl" data-field={`relatedPosts.items.${index}.media.placeholderLabel`}>{item.media.placeholderLabel}</div>
                    <div className="iph-dim" data-field={`relatedPosts.items.${index}.media.placeholderDimensions`}>{item.media.placeholderDimensions}</div>
                  </div>
                )}
              </div>
              <div className="related-card-body">
                <div className="related-card-cat" data-field={`relatedPosts.items.${index}.category`}>{item.category}</div>
                <div className="related-card-title" data-field={`relatedPosts.items.${index}.title`}>{item.title}</div>
                <div className="related-card-date" data-field={`relatedPosts.items.${index}.date`}>{item.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
