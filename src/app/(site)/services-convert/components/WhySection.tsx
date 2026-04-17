import { getConvertedNodeBinding } from "@/components/converted-editor";
import { renderIcon } from "@/lib/converted-pages/renderIcon";

type WhyData = {
  chip: string;
  title: string;
  lead: string;
  cards: { icon: string; title: string; description: string }[];
};

export default function WhySection({ data }: { data: WhyData }) {
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const leadNode = getConvertedNodeBinding(data, { field: 'lead', defaultTag: 'p', nodeKey: 'lead' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="svc-convert-why">
      <div className="wrap">
        <div className="svc-convert-why-inner">
          <div className="svc-convert-why-content">
            <div className="chip svc-convert-why-chip" data-r {...chipNode.props}>
              <span className="chip-dot svc-convert-blue-dot"></span>
              {data.chip}
            </div>
            <TitleTag className="svc-convert-why-title" data-r data-delay="1" {...titleNode.props}>
              {data.title}
            </TitleTag>
            <p className="svc-convert-why-lead" data-r data-delay="2" {...leadNode.props}>
              {data.lead}
            </p>
          </div>
          <div className="svc-convert-why-cards">
            {cards.map((card, index) => (
              <div key={card.title} className="svc-convert-why-card" data-r data-delay={index === 0 ? undefined : String(index)}>
                <div className="svc-convert-why-card-icon" {...getConvertedNodeBinding(data, { field: `cards.${index}.icon`, defaultTag: 'div', nodeKey: `cards_${index}_icon` }).props}>{renderIcon(card.icon)}</div>
                <h3 className="svc-convert-why-card-title" {...getConvertedNodeBinding(data, { field: `cards.${index}.title`, defaultTag: 'h3', nodeKey: `cards_${index}_title`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{card.title}</h3>
                <p className="svc-convert-why-card-desc" {...getConvertedNodeBinding(data, { field: `cards.${index}.description`, defaultTag: 'p', nodeKey: `cards_${index}_description` }).props}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
