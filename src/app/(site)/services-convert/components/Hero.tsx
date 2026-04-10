import Link from "next/link";
import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";

type HeroData = {
  chip: string;
  title: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
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
        <div className="svc-convert-hero-iph" data-r data-delay="2">
          <ConvertedPlaceholderImage
            className="iph"
            style={{ height: '100%' }}
            image={data.image}
            imageAlt={data.imageAlt}
            imageFit={data.imageFit}
            imagePosition={data.imagePosition}
            imageRadius={data.imageRadius}
            preservePlaceholderChrome={data.preservePlaceholderChrome}
            placeholderBackground={data.placeholderBackground}
            placeholderBorderColor={data.placeholderBorderColor}
            placeholderBorderWidth={data.placeholderBorderWidth}
            placeholderBorderStyle={data.placeholderBorderStyle}
            placeholderPadding={data.placeholderPadding}
            placeholderGap={data.placeholderGap}
            placeholderRadius={data.placeholderRadius}
            placeholderShowOverlay={data.placeholderShowOverlay}
            placeholderOverlay={data.placeholderOverlay}
            placeholderLabelColor={data.placeholderLabelColor}
            placeholderLabelSize={data.placeholderLabelSize}
            placeholderDimColor={data.placeholderDimColor}
            placeholderDimSize={data.placeholderDimSize}
            placeholderIconSize={data.placeholderIconSize}
            placeholderIcon={data.placeholderIcon}
            placeholderLabel={data.placeholderLabel}
            placeholderDimensions={data.placeholderDimensions}
          />
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
