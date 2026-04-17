import { getConvertedNodeBinding } from "@/components/converted-editor";
import { renderIcon } from "@/lib/converted-pages/renderIcon";

export type AboutValuesData = {
  chip: string;
  title: string;
  intro: string;
  items: { icon: string; title: string; description: string }[];
};

export default function AboutValues({ data }: { data: AboutValuesData }) {
  const items = Array.isArray(data.items) ? data.items : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const introNode = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p', nodeKey: 'intro' });
  const TitleTag = titleNode.Tag;
  return (
    <section className="about-values">
      <div className="wrap">
        <div className="about-values-header">
          <div className="chip about-values-chip" data-r {...chipNode.props}>
            <span className="chip-dot about-chip-purple" />
            {data.chip}
          </div>
          <TitleTag className="h1 about-values-title" data-r data-delay="1" {...titleNode.props}>
            {data.title}
          </TitleTag>
          <p className="about-values-intro" data-r data-delay="2" {...introNode.props}>
            {data.intro}
          </p>
        </div>
        <div className="about-values-grid">
          {items.map((item, index) => (
            <div className="about-value-item" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-value-${item.title}-${index}`}>
              <div className="about-value-icon" {...getConvertedNodeBinding(data, { field: `items.${index}.icon`, defaultTag: 'div', nodeKey: `items_${index}_icon` }).props}>{renderIcon(item.icon)}</div>
              <h3 className="about-value-title" {...getConvertedNodeBinding(data, { field: `items.${index}.title`, defaultTag: 'h3', nodeKey: `items_${index}_title`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{item.title}</h3>
              <p className="about-value-desc" {...getConvertedNodeBinding(data, { field: `items.${index}.description`, defaultTag: 'p', nodeKey: `items_${index}_description` }).props}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
