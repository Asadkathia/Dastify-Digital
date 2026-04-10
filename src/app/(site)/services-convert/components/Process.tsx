import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";

type ProcessData = {
  chip: string;
  title: string;
  intro: string;
  steps: { number: string; title: string; description: string }[];
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
};

export default function Process({ data }: { data: ProcessData }) {
  return (
    <section className="svc-convert-process">
      <div className="wrap">
        <div className="svc-convert-process-inner">
          <div className="svc-convert-process-content">
            <div className="chip svc-convert-process-chip" data-r>
              <span className="chip-dot"></span>
              {data.chip}
            </div>
            <h2 className="svc-convert-process-title" data-r data-delay="1">
              {data.title}
            </h2>
            <p className="svc-convert-process-intro" data-r data-delay="2">
              {data.intro}
            </p>
            <div className="svc-convert-process-steps">
              {data.steps.map((step, index) => (
                <div key={step.number} className="svc-convert-process-step" data-r data-delay={index === 0 ? undefined : String(index)}>
                  <div className="svc-convert-process-num">{step.number}</div>
                  <div className="svc-convert-process-step-content">
                    <h3 className="svc-convert-process-step-title">{step.title}</h3>
                    <p className="svc-convert-process-step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="svc-convert-process-iph" data-r data-delay="2">
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
      </div>
    </section>
  );
}
