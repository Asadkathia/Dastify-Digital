import Link from "next/link";

export type AboutCtaData = {
  title: string;
  subtext: string;
  buttons: { label: string; href: string; variant: "primary" | "ghost" }[];
};

export default function AboutCta({ data }: { data: AboutCtaData }) {
  return (
    <section className="about-cta-close">
      <div className="wrap about-cta-close-inner">
        <h2 className="about-cta-close-title" data-r>
          {data.title.split("\n").map((line, index) => (
            <span key={`about-cta-title-${line}-${index}`}>
              {line}
              {index < data.title.split("\n").length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p className="about-cta-close-sub" data-r data-delay="1">
          {data.subtext}
        </p>
        <div className="about-cta-close-btns" data-r data-delay="2">
          {data.buttons.map((item, index) => (
            <Link key={`about-cta-btn-${item.href ?? item.label}-${index}`} href={item.href} className={item.variant === "primary" ? "about-btn-cta-primary" : "about-btn-cta-ghost"}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
