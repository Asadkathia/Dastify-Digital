import { getConvertedNodeBinding } from "@/components/converted-editor";

export type AboutDifferenceData = {
  chip: string;
  title: string;
  intro: string;
  cards: { number: string; title: string; description: string }[];
};

export default function AboutDifference({ data }: { data: AboutDifferenceData }) {
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const introNode = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p', nodeKey: 'intro' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-difference">
      <div className="wrap">
        <div className="about-difference-header">
          <div className="chip about-difference-chip" data-r {...chipNode.props}>
            <span className="chip-dot about-chip-purple" />
            {data.chip}
          </div>
          <TitleTag className="h1 about-difference-title" data-r data-delay="1" {...titleNode.props}>
            {data.title}
          </TitleTag>
          <p className="about-difference-intro" data-r data-delay="2" {...introNode.props}>
            {data.intro}
          </p>
        </div>
        <div className="about-difference-grid">
          {cards.map((item, index) => (
            <div className="about-difference-card" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-difference-${item.title}-${index}`}>
              <div className="about-difference-num" {...getConvertedNodeBinding(data, { field: `cards.${index}.number`, defaultTag: 'div', nodeKey: `cards_${index}_number` }).props}>{item.number}</div>
              <h3 className="about-difference-card-title" {...getConvertedNodeBinding(data, { field: `cards.${index}.title`, defaultTag: 'h3', nodeKey: `cards_${index}_title`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{item.title}</h3>
              <p className="about-difference-card-desc" {...getConvertedNodeBinding(data, { field: `cards.${index}.description`, defaultTag: 'p', nodeKey: `cards_${index}_description` }).props}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
