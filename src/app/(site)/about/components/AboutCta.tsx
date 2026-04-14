import Link from "next/link";
import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutCtaData = {
  title: string;
  subtext: string;
  buttons: { label: string; href: string; variant: "primary" | "ghost" }[];
};

export default function AboutCta({ data }: { data: AboutCtaData }) {
  const titleLines = typeof data.title === "string" ? data.title.split("\n") : [];
  const buttons = Array.isArray(data.buttons) ? data.buttons : [];
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const subNode = getConvertedNodeBinding(data, { field: 'subtext', defaultTag: 'p', nodeKey: 'subtext' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-cta-close">
      <div className="wrap about-cta-close-inner">
        <TitleTag className="about-cta-close-title" data-r {...titleNode.props}>
          {titleLines.map((line, index) => (
            <span key={`about-cta-title-${line}-${index}`}>
              {line}
              {index < titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </TitleTag>
        <p className="about-cta-close-sub" data-r data-delay="1" {...subNode.props}>
          {data.subtext}
        </p>
        <div className="about-cta-close-btns" data-r data-delay="2">
          {buttons.map((item, index) => (
            <Link key={`about-cta-btn-${item.href ?? item.label}-${index}`} href={typeof item.href === "string" && item.href.length > 0 ? item.href : "#"} className={item.variant === "primary" ? "about-btn-cta-primary" : "about-btn-cta-ghost"} {...getConvertedNodeBinding(data, { field: `buttons.${index}.label`, defaultTag: 'a', nodeKey: `buttons_${index}_label` }).props}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
