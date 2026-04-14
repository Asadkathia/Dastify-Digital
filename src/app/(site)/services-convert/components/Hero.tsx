import Link from "next/link";
import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";
import { getConvertedNodeBinding } from "@/components/converted-editor";

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
  const titleLines = typeof data.title === "string" ? data.title.split("\n") : [];
  const marqueeItems = Array.isArray(data.marqueeItems) ? data.marqueeItems : [];
  const primaryHref = typeof data.primaryCta?.href === "string" && data.primaryCta.href.length > 0 ? data.primaryCta.href : "#";
  const secondaryHref = typeof data.secondaryCta?.href === "string" && data.secondaryCta.href.length > 0 ? data.secondaryCta.href : "#";
  const primaryLabel = typeof data.primaryCta?.label === "string" ? data.primaryCta.label : "";
  const secondaryLabel = typeof data.secondaryCta?.label === "string" ? data.secondaryCta.label : "";
  const marquee = [...marqueeItems, ...marqueeItems];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h1', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const leadNode = getConvertedNodeBinding(data, { field: 'lead', defaultTag: 'p', nodeKey: 'lead' });
  const primaryNode = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'a', nodeKey: 'primaryCtaLabel' });
  const secondaryNode = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'a', nodeKey: 'secondaryCtaLabel' });
  const TitleTag = titleNode.Tag;

  return (
    <section className="svc-convert-hero">
      <div className="svc-convert-hero-grid">
        <div className="svc-convert-hero-inner">
          <div className="chip svc-convert-hero-chip" data-r {...chipNode.props}>
            <span className="chip-dot"></span>
            {data.chip}
          </div>
          <TitleTag className="svc-convert-hero-title" data-r data-delay="1" {...titleNode.props}>
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </TitleTag>
          <p className="svc-convert-hero-lead" data-r data-delay="2" {...leadNode.props}>
            {data.lead}
          </p>
          <div className="svc-convert-hero-ctas" data-r data-delay="3">
            <Link href={primaryHref} className="btn-dk" {...primaryNode.props}>
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="btn-ol" {...secondaryNode.props}>
              {secondaryLabel}
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
            <span
              key={`${item}-${index}`}
              className="svc-convert-marquee-item"
              {...getConvertedNodeBinding(data, { field: `marqueeItems.${marqueeItems.length === 0 ? 0 : index % marqueeItems.length}`, defaultTag: 'span', nodeKey: `marqueeItems_${marqueeItems.length === 0 ? 0 : index % marqueeItems.length}` }).props}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
