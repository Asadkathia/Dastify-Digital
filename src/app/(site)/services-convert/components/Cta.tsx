import Link from "next/link";

type CtaData = {
  title: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export default function Cta({ data }: { data: CtaData }) {
  return (
    <section className="svc-convert-cta">
      <div className="wrap svc-convert-cta-inner">
        <h2 className="svc-convert-cta-title" data-r>
          {data.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < data.title.split("\n").length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p className="svc-convert-cta-sub" data-r data-delay="1">
          {data.subtext}
        </p>
        <div className="svc-convert-cta-btns" data-r data-delay="2">
          <Link href={data.primaryCta.href} className="svc-convert-btn-cta-primary">
            {data.primaryCta.label}
          </Link>
          <Link href={data.secondaryCta.href} className="svc-convert-btn-cta-ghost">
            {data.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
