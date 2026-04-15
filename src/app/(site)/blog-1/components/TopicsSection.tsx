import type { PageContent } from "../content";

type Props = { data: PageContent["topics"] };

export default function TopicsSection({ data }: Props) {
  const TitleTag = data.titleTag || "h2";

  return (
    <section className="blog1-topics-section">
      <div className="wrap">
        <div className="blog1-topics-header" data-r>
          <TitleTag
            className="blog1-topics-title"
            data-field="topics.title"
            data-style-field="topics.editor.nodes.title.styles"
            data-tag-field="topics.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <p className="blog1-topics-sub" data-field="topics.subtitle">{data.subtitle}</p>
        </div>
        <div className="blog1-topics-grid">
          {data.items.map((item, index) => (
            <div className="blog1-topic-card" data-r data-delay={String(index + 1)} key={`${"topics"}-${item.name}-${index}`}>
              <div className="blog1-topic-icon" data-field={`topics.items.${index}.icon`}>{item.icon}</div>
              <div className="blog1-topic-name" data-field={`topics.items.${index}.name`}>{item.name}</div>
              <div className="blog1-topic-count" data-field={`topics.items.${index}.count`}>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
