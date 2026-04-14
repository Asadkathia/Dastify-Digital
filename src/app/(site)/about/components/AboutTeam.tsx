import Link from "next/link";
import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";
import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutTeamData = {
  watermark: string;
  chip: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  cta: { label: string; href: string };
  visuals: {
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
    height: string;
    className: string;
  }[];
};

export default function AboutTeam({ data }: { data: AboutTeamData }) {
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const visuals = Array.isArray(data.visuals) ? data.visuals : [];
  const watermarkNode = getConvertedNodeBinding(data, { field: 'watermark', defaultTag: 'span', nodeKey: 'watermark' });
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const descriptionNode = getConvertedNodeBinding(data, { field: 'description', defaultTag: 'p', nodeKey: 'description' });
  const ctaNode = getConvertedNodeBinding(data, { field: 'cta.label', defaultTag: 'a', nodeKey: 'cta_label' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-team">
      <span className="sec-wm g2" {...watermarkNode.props}>{data.watermark}</span>
      <div className="wrap">
        <div className="about-team-inner">
          <div className="about-team-content">
            <div className="chip about-team-chip" data-r {...chipNode.props}>
              <span className="chip-dot" />
              {data.chip}
            </div>
            <TitleTag className="h1 about-team-title" data-r data-delay="1" {...titleNode.props}>
              {data.title}
            </TitleTag>
            <p className="about-team-desc" data-r data-delay="2" {...descriptionNode.props}>
              {data.description}
            </p>
            <div className="about-team-stats" data-r data-delay="3">
              {stats.map((item, index) => (
                <div className="about-team-stat" key={`about-team-stat-${item.label}-${index}`}>
                  <div className="about-stat-num" {...getConvertedNodeBinding(data, { field: `stats.${index}.value`, defaultTag: 'div', nodeKey: `stats_${index}_value` }).props}>{item.value}</div>
                  <div className="about-stat-lbl" {...getConvertedNodeBinding(data, { field: `stats.${index}.label`, defaultTag: 'div', nodeKey: `stats_${index}_label` }).props}>{item.label}</div>
                </div>
              ))}
            </div>
            <Link href={typeof data.cta?.href === "string" && data.cta.href.length > 0 ? data.cta.href : "#"} className="btn-dk" data-r data-delay="4" {...ctaNode.props}>
              {typeof data.cta?.label === "string" ? data.cta.label : ""}
            </Link>
          </div>
          <div className="about-team-visual">
            {visuals.map((item, index) => (
              <div
                className={item.className}
                data-r
                data-delay={index === 0 ? undefined : `${index}`}
                key={`about-team-visual-${item.label}-${index}`}
                style={{ height: item.height }}
              >
                <ConvertedPlaceholderImage
                  className="iph"
                  style={{ height: '100%' }}
                  image={item.image}
                  imageAlt={item.imageAlt}
                  imageFit={item.imageFit}
                  imagePosition={item.imagePosition}
                  imageRadius={item.imageRadius}
                  preservePlaceholderChrome={item.preservePlaceholderChrome}
                  placeholderBackground={item.placeholderBackground}
                  placeholderBorderColor={item.placeholderBorderColor}
                  placeholderBorderWidth={item.placeholderBorderWidth}
                  placeholderBorderStyle={item.placeholderBorderStyle}
                  placeholderPadding={item.placeholderPadding}
                  placeholderGap={item.placeholderGap}
                  placeholderRadius={item.placeholderRadius}
                  placeholderShowOverlay={item.placeholderShowOverlay}
                  placeholderOverlay={item.placeholderOverlay}
                  placeholderLabelColor={item.placeholderLabelColor}
                  placeholderLabelSize={item.placeholderLabelSize}
                  placeholderDimColor={item.placeholderDimColor}
                  placeholderDimSize={item.placeholderDimSize}
                  placeholderIconSize={item.placeholderIconSize}
                  placeholderIcon={item.icon}
                  placeholderLabel={item.label}
                  placeholderDimensions={item.dimensions}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
