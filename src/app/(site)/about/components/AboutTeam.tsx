import Link from "next/link";
import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";

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
  return (
    <section className="about-team">
      <span className="sec-wm g2">{data.watermark}</span>
      <div className="wrap">
        <div className="about-team-inner">
          <div className="about-team-content">
            <div className="chip about-team-chip" data-r>
              <span className="chip-dot" />
              {data.chip}
            </div>
            <h2 className="h1 about-team-title" data-r data-delay="1">
              {data.title}
            </h2>
            <p className="about-team-desc" data-r data-delay="2">
              {data.description}
            </p>
            <div className="about-team-stats" data-r data-delay="3">
              {data.stats.map((item, index) => (
                <div className="about-team-stat" key={`about-team-stat-${item.label}-${index}`}>
                  <div className="about-stat-num">{item.value}</div>
                  <div className="about-stat-lbl">{item.label}</div>
                </div>
              ))}
            </div>
            <Link href={data.cta.href} className="btn-dk" data-r data-delay="4">
              {data.cta.label}
            </Link>
          </div>
          <div className="about-team-visual">
            {data.visuals.map((item, index) => (
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
