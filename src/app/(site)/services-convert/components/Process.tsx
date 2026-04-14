import { ConvertedPlaceholderImage } from "@/components/ConvertedPlaceholderImage";
import { getConvertedNodeBinding } from "@/components/converted-editor";

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
  const steps = Array.isArray(data.steps) ? data.steps : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const introNode = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p', nodeKey: 'intro' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="svc-convert-process">
      <div className="wrap">
        <div className="svc-convert-process-inner">
          <div className="svc-convert-process-content">
            <div className="chip svc-convert-process-chip" data-r {...chipNode.props}>
              <span className="chip-dot"></span>
              {data.chip}
            </div>
            <TitleTag className="svc-convert-process-title" data-r data-delay="1" {...titleNode.props}>
              {data.title}
            </TitleTag>
            <p className="svc-convert-process-intro" data-r data-delay="2" {...introNode.props}>
              {data.intro}
            </p>
            <div className="svc-convert-process-steps">
              {steps.map((step, index) => (
                <div key={step.number} className="svc-convert-process-step" data-r data-delay={index === 0 ? undefined : String(index)}>
                  <div className="svc-convert-process-num" {...getConvertedNodeBinding(data, { field: `steps.${index}.number`, defaultTag: 'div', nodeKey: `steps_${index}_number` }).props}>{step.number}</div>
                  <div className="svc-convert-process-step-content">
                    <h3 className="svc-convert-process-step-title" {...getConvertedNodeBinding(data, { field: `steps.${index}.title`, defaultTag: 'h3', nodeKey: `steps_${index}_title`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{step.title}</h3>
                    <p className="svc-convert-process-step-desc" {...getConvertedNodeBinding(data, { field: `steps.${index}.description`, defaultTag: 'p', nodeKey: `steps_${index}_description` }).props}>{step.description}</p>
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
