import Link from "next/link";

export type AboutHeroData = {
  chip: string;
  title: string;
  lead: string;
  ctas: { label: string; href: string; variant: "dark" | "outline" }[];
  stats: { value: string; label: string }[];
  visual: { icon: string; label: string; dimensions: string };
  marquee: string[];
};

export default function AboutHero({ data }: { data: AboutHeroData }) {
  return (
    <section className="about-hero">
      <div className="about-hero-content">
        <div className="chip about-hero-chip" data-r>
          <span className="chip-dot" />
          {data.chip}
        </div>
        <h1 className="masthead about-hero-title" data-r data-delay="1">
          {data.title.split("\n").map((line, index) => (
            <span key={`about-hero-title-${line}-${index}`}>
              {line}
              {index < data.title.split("\n").length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <p className="lead about-hero-lead" data-r data-delay="2">
          {data.lead}
        </p>
        <div className="about-hero-ctas" data-r data-delay="3">
          {data.ctas.map((item, index) => (
            <Link
              key={`about-hero-cta-${item.href ?? item.label}-${index}`}
              href={item.href}
              className={item.variant === "dark" ? "btn-dk" : "btn-ol"}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="about-hero-stats" data-r data-delay="4">
          {data.stats.map((item, index) => (
            <div className="about-hero-stat-pill" key={`about-hero-stat-${item.label}-${index}`}>
              <strong>{item.value}</strong> {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="about-hero-visual" data-r="R" data-delay="2">
        <div className="iph" style={{ width: "100%", height: 520 }}>
          <div className="iph-ic">{data.visual.icon}</div>
          <span className="iph-lbl">{data.visual.label}</span>
          <span className="iph-dim">{data.visual.dimensions}</span>
        </div>
      </div>
      <div className="about-marquee-strip">
        <div className="about-marquee-track">
          {[...data.marquee, ...data.marquee].map((item, index) => (
            <span className="about-marquee-item" key={`about-marquee-${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
