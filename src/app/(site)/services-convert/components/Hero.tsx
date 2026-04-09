import Link from "next/link";

type HeroData = {
  chip: string;
  title: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  placeholderIcon: string;
  placeholderLabel: string;
  placeholderDimensions: string;
  marqueeItems: string[];
};

export default function Hero({ data }: { data: HeroData }) {
  const marquee = [...data.marqueeItems, ...data.marqueeItems];

  return (
    <section className="svc-convert-hero">
      <div className="svc-convert-hero-grid">
        <div className="svc-convert-hero-inner">
          <div className="chip svc-convert-hero-chip" data-r>
            <span className="chip-dot"></span>
            {data.chip}
          </div>
          <h1 className="svc-convert-hero-title" data-r data-delay="1">
            {data.title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < data.title.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="svc-convert-hero-lead" data-r data-delay="2">
            {data.lead}
          </p>
          <div className="svc-convert-hero-ctas" data-r data-delay="3">
            <Link href={data.primaryCta.href} className="btn-dk">
              {data.primaryCta.label}
            </Link>
            <Link href={data.secondaryCta.href} className="btn-ol">
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className="iph svc-convert-hero-iph" data-r data-delay="2">
          <div className="iph-ic">{data.placeholderIcon}</div>
          <span className="iph-lbl">{data.placeholderLabel}</span>
          <span className="iph-dim">{data.placeholderDimensions}</span>
        </div>
      </div>
      <div className="svc-convert-marquee">
        <div className="svc-convert-marquee-track">
          {marquee.map((item, index) => (
            <span key={`${item}-${index}`} className="svc-convert-marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
