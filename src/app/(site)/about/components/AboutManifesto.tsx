import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutManifestoData = {
  watermark: string;
  headline: string;
  highlight: string;
  statements: string[];
  paragraphs: string[];
};

export default function AboutManifesto({ data }: { data: AboutManifestoData }) {
  const statements = Array.isArray(data.statements) ? data.statements : [];
  const paragraphs = Array.isArray(data.paragraphs) ? data.paragraphs : [];
  const headlineNode = getConvertedNodeBinding(data, { field: 'headline', defaultTag: 'h2', nodeKey: 'headline', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const highlightNode = getConvertedNodeBinding(data, { field: 'highlight', defaultTag: 'span', nodeKey: 'highlight' });
  const HeadlineTag = headlineNode.Tag;
  return (
    <section className="about-manifesto">
      <span className="sec-wm g1">{data.watermark}</span>
      <div className="wrap">
        <div className="about-manifesto-inner">
          <div className="about-manifesto-left">
            <HeadlineTag className="h1 about-manifesto-headline" data-r {...headlineNode.props}>
              {data.headline} <span className="about-manifesto-highlight" {...highlightNode.props}>{data.highlight}</span>
            </HeadlineTag>
            <div className="about-manifesto-statements">
              {statements.map((item, index) => (
                <div className="about-manifesto-statement" data-r data-delay={`${index + 1}`} key={`about-manifesto-statement-${item}-${index}`}>
                  <p {...getConvertedNodeBinding(data, { field: `statements.${index}`, defaultTag: 'p', nodeKey: `statements_${index}` }).props}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-manifesto-right">
            <div className="about-manifesto-copy">
              {paragraphs.map((item, index) => (
                <p
                  data-r
                  data-delay={index === 0 ? undefined : `${index}`}
                  key={`about-manifesto-copy-${item.slice(0, 20)}-${index}`}
                  data-rich-text="true"
                  {...getConvertedNodeBinding(data, { field: `paragraphs.${index}`, defaultTag: 'p', nodeKey: `paragraphs_${index}` }).props}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="about-manifesto-divider" />
      </div>
    </section>
  );
}
