import type { PageContent } from "./types";

type Props = {
  data: PageContent["hero"];
};

export default function ContactHero({ data }: Props) {
  const TitleTag = (data.titleTag || "h1") as "h1" | "h2" | "h3" | "h4" | "p" | "span";

  return (
    <section className="contact-hero">
      <span className="sec-wm g1" data-field="hero.watermark">
        {data.watermark}
      </span>
      <div className="wrap" data-r>
        <div className="chip contact2-hero-chip" data-field="hero.chipText">
          <span className="chip-dot" />
          {data.chipText}
        </div>
        <TitleTag
          className="contact-hero-title"
          data-field="hero.title"
          data-style-field="hero.editor.nodes.title.styles"
          data-tag-field="hero.titleTag"
          data-allowed-tags="h1,h2,h3"
        >
          {data.title}
        </TitleTag>
        <p
          className="contact-hero-sub"
          data-field="hero.subtitle"
          data-style-field="hero.editor.nodes.subtitle.styles"
        >
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}
