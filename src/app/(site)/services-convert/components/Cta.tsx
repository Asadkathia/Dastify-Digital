import Link from "next/link";
import { getConvertedNodeBinding } from "@/components/converted-editor";

type CtaData = {
  title: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export default function Cta({ data }: { data: CtaData }) {
  const titleLines = typeof data.title === "string" ? data.title.split("\n") : [];
  const primaryHref = typeof data.primaryCta?.href === "string" && data.primaryCta.href.length > 0 ? data.primaryCta.href : "#";
  const secondaryHref = typeof data.secondaryCta?.href === "string" && data.secondaryCta.href.length > 0 ? data.secondaryCta.href : "#";
  const primaryLabel = typeof data.primaryCta?.label === "string" ? data.primaryCta.label : "";
  const secondaryLabel = typeof data.secondaryCta?.label === "string" ? data.secondaryCta.label : "";
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const subtextNode = getConvertedNodeBinding(data, { field: 'subtext', defaultTag: 'p', nodeKey: 'subtext' });
  const primaryNode = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'a', nodeKey: 'primaryCta_label' });
  const secondaryNode = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'a', nodeKey: 'secondaryCta_label' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="svc-convert-cta">
      <div className="wrap svc-convert-cta-inner">
        <TitleTag className="svc-convert-cta-title" data-r {...titleNode.props}>
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </TitleTag>
        <p className="svc-convert-cta-sub" data-r data-delay="1" {...subtextNode.props}>
          {data.subtext}
        </p>
        <div className="svc-convert-cta-btns" data-r data-delay="2">
          <Link href={primaryHref} className="svc-convert-btn-cta-primary" {...primaryNode.props}>
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="svc-convert-btn-cta-ghost" {...secondaryNode.props}>
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
