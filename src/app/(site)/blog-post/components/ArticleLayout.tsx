"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { PageContent } from "../content";

type Props = { data: PageContent["article"] };

function PlaceholderMedia({ media, fieldPath, aspectClass }: { media: any; fieldPath: string; aspectClass: string }) {
  return (
    <div className={aspectClass}>
      {media.image ? (
        <div className="blog-post-media-frame">
          <Image
            src={media.image}
            alt={media.imageAlt || ""}
            fill
            sizes="(max-width: 900px) 100vw, 720px"
            style={{ objectFit: media.imageFit || "cover", objectPosition: media.imagePosition || "center", borderRadius: media.imageRadius || "4px" }}
            data-field={`${fieldPath}.image` as string}
          />
        </div>
      ) : (
        <div
          className="iph"
          data-field={`${fieldPath}.placeholderLabel`}
          style={{
            aspectRatio: media.aspectRatio || "16/9",
            background: media.placeholderBackground || undefined,
            borderColor: media.placeholderBorderColor || undefined,
            borderWidth: media.placeholderBorderWidth || undefined,
            borderStyle: media.placeholderBorderStyle || undefined,
            padding: media.placeholderPadding || undefined,
            gap: media.placeholderGap || undefined,
            borderRadius: media.placeholderRadius || undefined,
          }}
        >
          <div className="iph-ic" data-field={`${fieldPath}.placeholderIcon`}>{media.placeholderIcon}</div>
          <div className="iph-lbl" data-field={`${fieldPath}.placeholderLabel`}>{media.placeholderLabel}</div>
          <div className="iph-dim" data-field={`${fieldPath}.placeholderDimensions`}>{media.placeholderDimensions}</div>
        </div>
      )}
    </div>
  );
}

export default function ArticleLayout({ data }: Props) {
  const [activeId, setActiveId] = useState(data.sidebar.toc[0]?.href.replace("#", "") || "");

  const headingIds = useMemo(() => data.sidebar.toc.map((item) => item.href.replace("#", "")), [data.sidebar.toc]);

  useEffect(() => {
    const onScroll = () => {
      let current = headingIds[0] || "";
      headingIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headingIds]);

  return (
    <section className="blog-post-article-layout article-layout">
      <div className="wrap">
        <article className="blog-post-article-content article-content" data-r>
          <div className="article-featured-img">
            <PlaceholderMedia media={data.featuredImage} fieldPath="article.featuredImage" aspectClass="blog-post-featured-media" />
          </div>

          {data.blocks.map((block, index) => {
            if (block.type === "paragraph") {
              return <p key={`article-${block.type}-${index}`} data-field={`article.blocks.${index}.text`} dangerouslySetInnerHTML={{ __html: block.html || block.text }} />;
            }
            if (block.type === "stats") {
              return (
                <div key={`article-${block.type}-${index}`} className="blog-post-article-stat-strip article-stat-strip">
                  {block.items.map((item: any, statIndex: number) => (
                    <div key={`article-stats-${item.label}-${statIndex}`} className="article-stat">
                      <div className="num" data-field={`article.blocks.${index}.items.${statIndex}.value`}>{item.value}</div>
                      <div className="lbl" data-field={`article.blocks.${index}.items.${statIndex}.label`}>{item.label}</div>
                    </div>
                  ))}
                </div>
              );
            }
            if (block.type === "heading") {
              if (block.level === 2) {
                const Tag = (block.tag || "h2") as "h2" | "h3" | "h4";
                return (
                  <Tag
                    key={`article-${block.type}-${index}`}
                    id={block.id}
                    data-field={`article.blocks.${index}.text`}
                    data-tag-field={`article.blocks.${index}.tag`}
                    data-allowed-tags="h2,h3,h4"
                  >
                    {block.text}
                  </Tag>
                );
              }
              const Tag = (block.tag || "h3") as "h3" | "h4";
              return (
                <Tag
                  key={`article-${block.type}-${index}`}
                  id={block.id}
                  data-field={`article.blocks.${index}.text`}
                  data-tag-field={`article.blocks.${index}.tag`}
                  data-allowed-tags="h3,h4"
                >
                  {block.text}
                </Tag>
              );
            }
            if (block.type === "callout") {
              return (
                <div key={`article-${block.type}-${index}`} className="blog-post-article-callout article-callout">
                  <div className="article-callout-title" data-field={`article.blocks.${index}.title`}>{block.title}</div>
                  <p data-field={`article.blocks.${index}.text`}>{block.text}</p>
                </div>
              );
            }
            if (block.type === "image") {
              return (
                <div key={`article-${block.type}-${index}`} className="article-inline-img">
                  <PlaceholderMedia media={block.media} fieldPath={`article.blocks.${index}.media`} aspectClass="blog-post-inline-media" />
                </div>
              );
            }
            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag key={`article-${block.type}-${index}`}>
                  {block.items.map((item: any, itemIndex: number) => (
                    <li
                      key={`article-list-${item.text}-${itemIndex}`}
                      data-field={`article.blocks.${index}.items.${itemIndex}.text`}
                      dangerouslySetInnerHTML={{ __html: item.html || item.text }}
                    />
                  ))}
                </ListTag>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={`article-${block.type}-${index}`}>
                  <p data-field={`article.blocks.${index}.text`}>{block.text}</p>
                </blockquote>
              );
            }
            if (block.type === "authorBio") {
              return (
                <div key={`article-${block.type}-${index}`} className="blog-post-author-bio author-bio">
                  <div className="author-bio-avatar">
                    {block.avatar.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={block.avatar.image} alt={block.avatar.imageAlt} className="blog-post-avatar-img" data-field={`article.blocks.${index}.avatar.image`} />
                    ) : (
                      <span data-field={`article.blocks.${index}.avatar.placeholderIcon`}>{block.avatar.placeholderIcon}</span>
                    )}
                  </div>
                  <div>
                    <div className="author-bio-name" data-field={`article.blocks.${index}.name`}>{block.name}</div>
                    <div className="author-bio-role" data-field={`article.blocks.${index}.role`}>{block.role}</div>
                    <p className="author-bio-desc" data-field={`article.blocks.${index}.description`}>{block.description}</p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </article>

        <aside className="blog-post-article-sidebar article-sidebar">
          <div className="blog-post-sidebar-toc sidebar-toc">
            <div className="sidebar-toc-title" data-field="article.sidebar.tocTitle">{data.sidebar.tocTitle}</div>
            {data.sidebar.toc.map((item, index) => (
              <a
                key={`sidebar-toc-${item.href}-${index}`}
                href={item.href}
                className={`sidebar-toc-link${activeId === item.href.replace("#", "") ? " active" : ""}`}
                data-field={`article.sidebar.toc.${index}.label`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="blog-post-sidebar-cta sidebar-cta">
            <div className="sidebar-cta-title" data-field="article.sidebar.cta.title">{data.sidebar.cta.title}</div>
            <p className="sidebar-cta-desc" data-field="article.sidebar.cta.description">{data.sidebar.cta.description}</p>
            <Link href={data.sidebar.cta.button.href} className="btn-pu blog-post-sidebar-cta-btn" data-field="article.sidebar.cta.button.label">
              {data.sidebar.cta.button.label}
            </Link>
          </div>

          <div className="blog-post-sidebar-related sidebar-related">
            <div className="sidebar-related-title" data-field="article.sidebar.relatedTitle">{data.sidebar.relatedTitle}</div>
            {data.sidebar.related.map((item, index) => (
              <Link key={`sidebar-related-${item.href}-${index}`} href={item.href} className="sidebar-related-item">
                <div className="sidebar-related-cat" data-field={`article.sidebar.related.${index}.category`}>{item.category}</div>
                <div className="sidebar-related-name" data-field={`article.sidebar.related.${index}.title`}>{item.title}</div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
