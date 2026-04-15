import type { PageContent } from "../content";

type Props = { data: PageContent["hero"] };

export default function BlogHero({ data }: Props) {
  const TitleTag = data.titleTag || "h1";

  return (
    <section className="blog1-blog-hero">
      <span className="sec-wm g1" data-field="hero.watermark">
        {data.watermark}
      </span>
      <div className="wrap">
        <div className="blog1-blog-hero-content" data-r>
          <div className="chip blog1-chip-space" data-field="hero.chipText">
            <span className="chip-dot" />
            {data.chipText}
          </div>
          <TitleTag
            className="blog1-blog-hero-title"
            data-field="hero.title"
            data-style-field="hero.editor.nodes.title.styles"
            data-tag-field="hero.titleTag"
            data-allowed-tags="h1,h2,h3"
          >
            {data.title}
          </TitleTag>
          <p
            className="blog1-blog-hero-sub"
            data-field="hero.subtitle"
            data-style-field="hero.editor.nodes.subtitle.styles"
          >
            {data.subtitle}
          </p>
        </div>
        <div className="blog1-blog-hero-stats" data-r data-delay="2">
          {data.stats.map((item, index) => (
            <div className="blog1-blog-hero-stat" key={`${"hero-stats"}-${item.label}-${index}`}>
              <div className="blog1-blog-hero-stat-num" data-field={`hero.stats.${index}.value`}>
                {item.value}
              </div>
              <div className="blog1-blog-hero-stat-lbl" data-field={`hero.stats.${index}.label`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
