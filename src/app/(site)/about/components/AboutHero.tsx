import Link from "next/link";
import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";
import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutHeroData = {
  chip: string;
  title: string;
  lead: string;
  ctas: { label: string; href: string; variant: "dark" | "outline" }[];
  stats: { value: string; label: string }[];
  visual: {
    image?: string | { url?: string; alt?: string; filename?: string } | null;
    imageAlt?: string;
    imageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    imagePosition?: string;
    imageRadius?: string;
    preservePlaceholderChrome?: boolean;
    placeholderBackground?: string;
    placeholderBorderColor?: string;
    placeholderBorderWidth?: string;
    placeholderBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    placeholderPadding?: string;
    placeholderGap?: string;
    placeholderRadius?: string;
    placeholderShowOverlay?: boolean;
    placeholderOverlay?: string;
    placeholderLabelColor?: string;
    placeholderLabelSize?: string;
    placeholderDimColor?: string;
    placeholderDimSize?: string;
    placeholderIconSize?: string;
    icon: string;
    label: string;
    dimensions: string;
  };
  marquee: string[];
};

export default function AboutHero({ data }: { data: AboutHeroData }) {
  const titleLines = typeof data.title === "string" ? data.title.split("\n") : [];
  const ctas = Array.isArray(data.ctas) ? data.ctas : [];
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const marqueeItems = Array.isArray(data.marquee) ? data.marquee : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h1', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const leadNode = getConvertedNodeBinding(data, { field: 'lead', defaultTag: 'p', nodeKey: 'lead' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-hero">
      <div className="about-hero-content">
        <div className="chip about-hero-chip" data-r {...chipNode.props}>
          <span className="chip-dot" />
          {data.chip}
        </div>
        <TitleTag className="masthead about-hero-title" data-r data-delay="1" {...titleNode.props}>
          {titleLines.map((line, index) => (
            <span key={`about-hero-title-${line}-${index}`}>
              {line}
              {index < titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </TitleTag>
        <p className="lead about-hero-lead" data-r data-delay="2" {...leadNode.props}>
          {data.lead}
        </p>
        <div className="about-hero-ctas" data-r data-delay="3">
          {ctas.map((item, index) => (
            <Link
              key={`about-hero-cta-${item.href ?? item.label}-${index}`}
              href={typeof item.href === "string" && item.href.length > 0 ? item.href : "#"}
              className={item.variant === "dark" ? "btn-dk" : "btn-ol"}
              {...getConvertedNodeBinding(data, { field: `ctas.${index}.label`, defaultTag: 'a', nodeKey: `ctas_${index}_label` }).props}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="about-hero-stats" data-r data-delay="4">
          {stats.map((item, index) => (
            <div className="about-hero-stat-pill" key={`about-hero-stat-${item.label}-${index}`}>
              <strong {...getConvertedNodeBinding(data, { field: `stats.${index}.value`, defaultTag: 'strong', nodeKey: `stats_${index}_value` }).props}>{item.value}</strong>{' '}
              <span {...getConvertedNodeBinding(data, { field: `stats.${index}.label`, defaultTag: 'span', nodeKey: `stats_${index}_label` }).props}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="about-hero-visual" data-r="R" data-delay="2">
        <ConvertedPlaceholderImage
          className="iph"
          style={{ width: "100%", height: 520 }}
          image={data.visual.image}
          imageAlt={data.visual.imageAlt}
          imageFit={data.visual.imageFit}
          imagePosition={data.visual.imagePosition}
          imageRadius={data.visual.imageRadius}
          preservePlaceholderChrome={data.visual.preservePlaceholderChrome}
          placeholderBackground={data.visual.placeholderBackground}
          placeholderBorderColor={data.visual.placeholderBorderColor}
          placeholderBorderWidth={data.visual.placeholderBorderWidth}
          placeholderBorderStyle={data.visual.placeholderBorderStyle}
          placeholderPadding={data.visual.placeholderPadding}
          placeholderGap={data.visual.placeholderGap}
          placeholderRadius={data.visual.placeholderRadius}
          placeholderShowOverlay={data.visual.placeholderShowOverlay}
          placeholderOverlay={data.visual.placeholderOverlay}
          placeholderLabelColor={data.visual.placeholderLabelColor}
          placeholderLabelSize={data.visual.placeholderLabelSize}
          placeholderDimColor={data.visual.placeholderDimColor}
          placeholderDimSize={data.visual.placeholderDimSize}
          placeholderIconSize={data.visual.placeholderIconSize}
          placeholderIcon={data.visual.icon}
          placeholderLabel={data.visual.label}
          placeholderDimensions={data.visual.dimensions}
        />
      </div>
      <div className="about-marquee-strip">
        <div className="about-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              className="about-marquee-item"
              key={`about-marquee-${item}-${index}`}
              {...getConvertedNodeBinding(data, { field: `marquee.${marqueeItems.length === 0 ? 0 : index % marqueeItems.length}`, defaultTag: 'span', nodeKey: `marquee_${marqueeItems.length === 0 ? 0 : index % marqueeItems.length}` }).props}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
