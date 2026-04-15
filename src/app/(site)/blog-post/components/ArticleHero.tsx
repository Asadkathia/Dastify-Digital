import Link from "next/link";
import type { PageContent } from "../content";

type Props = { data: PageContent["hero"] };

export default function ArticleHero({ data }: Props) {
  const TitleTag = (data.titleTag || "h1") as "h1" | "h2" | "h3" | "h4";

  return (
    <section className="blog-post-article-hero article-hero">
      <div className="wrap" data-r>
        <div className="blog-post-breadcrumb breadcrumb">
          {data.breadcrumbs.map((item, index) => (
            <span key={`hero-${item.href ?? item.label}-${index}`} className="blog-post-breadcrumb-item">
              {item.href ? (
                <Link href={item.href} data-field={`hero.breadcrumbs.${index}.label`}>
                  {item.label}
                </Link>
              ) : (
                <span data-field={`hero.breadcrumbs.${index}.label`}>{item.label}</span>
              )}
              {index < data.breadcrumbs.length - 1 ? <span className="sep">/</span> : null}
            </span>
          ))}
        </div>
        <div className="blog-post-article-cats article-cats">
          {data.categories.map((item, index) => (
            <span
              key={`hero-cat-${item.label}-${index}`}
              className={`blog-post-article-cat article-cat${item.variant === "blue" ? " blue" : ""}`}
              data-field={`hero.categories.${index}.label`}
            >
              {item.label}
            </span>
          ))}
        </div>
        <TitleTag
          className="blog-post-article-hero-title article-hero-title"
          data-field="hero.title"
          data-style-field="hero.editor.nodes.title.styles"
          data-tag-field="hero.titleTag"
          data-allowed-tags="h1,h2,h3,h4"
        >
          {data.title}
        </TitleTag>
        <div className="blog-post-article-meta article-meta">
          <div className="blog-post-article-author article-author">
            <div className="blog-post-article-author-avatar article-author-avatar">
              {data.author.avatar.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.author.avatar.image} alt={data.author.avatar.imageAlt} className="blog-post-avatar-img" data-field="hero.author.avatar.image" />
              ) : (
                <span data-field="hero.author.avatar.placeholderIcon">{data.author.avatar.placeholderIcon}</span>
              )}
            </div>
            <div>
              <div className="article-author-name" data-field="hero.author.name">{data.author.name}</div>
              <div className="article-author-role" data-field="hero.author.role">{data.author.role}</div>
            </div>
          </div>
          <div className="article-meta-sep" />
          <div className="article-meta-item"><strong data-field="hero.publishDate">{data.publishDate}</strong></div>
          <div className="article-meta-item" data-field="hero.readTime">{data.readTime}</div>
        </div>
      </div>
    </section>
  );
}
