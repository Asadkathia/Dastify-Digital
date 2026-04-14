import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutStoryData = {
  watermark: string;
  chip: string;
  title: string;
  intro: string;
  items: { year: string; title: string; description: string }[];
};

export default function AboutStory({ data }: { data: AboutStoryData }) {
  const items = Array.isArray(data.items) ? data.items : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const introNode = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p', nodeKey: 'intro' });
  const watermarkNode = getConvertedNodeBinding(data, { field: 'watermark', defaultTag: 'span', nodeKey: 'watermark' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-story">
      <span className="sec-wm g3" {...watermarkNode.props}>{data.watermark}</span>
      <div className="wrap">
        <div className="about-story-header">
          <div className="chip about-story-chip" data-r {...chipNode.props}>
            <span className="chip-dot about-chip-blue" />
            {data.chip}
          </div>
          <TitleTag className="h1 about-story-title" data-r data-delay="1" {...titleNode.props}>
            {data.title}
          </TitleTag>
          <p className="about-story-intro" data-r data-delay="2" {...introNode.props}>
            {data.intro}
          </p>
        </div>
        <div className="about-timeline">
          {items.map((item, index) => (
            <div className="about-timeline-item" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-timeline-${item.year}-${index}`}>
              <div className="about-timeline-content">
                <div className="about-timeline-year" {...getConvertedNodeBinding(data, { field: `items.${index}.year`, defaultTag: 'div', nodeKey: `items_${index}_year` }).props}>{item.year}</div>
                <h3 className="about-timeline-title" {...getConvertedNodeBinding(data, { field: `items.${index}.title`, defaultTag: 'h3', nodeKey: `items_${index}_title`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{item.title}</h3>
                <p className="about-timeline-desc" {...getConvertedNodeBinding(data, { field: `items.${index}.description`, defaultTag: 'p', nodeKey: `items_${index}_description` }).props}>{item.description}</p>
              </div>
              <div className="about-timeline-dot">
                <div className="about-timeline-dot-inner" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
