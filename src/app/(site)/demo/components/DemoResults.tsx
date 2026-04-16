type PageContent = import("./types").PageContent;

type ResultsData = PageContent["results"];

export default function DemoResults({ data }: { data: ResultsData }) {
  const TitleTag = (data.titleTag || "h2") as "h1" | "h2" | "h3" | "h4" | "p" | "span";

  return (
    <section className="results-section">
      <div className="wrap">
        <div className="results-header" data-r>
          <div className="chip demo-inline-chip">
            <span className="chip-dot"></span>
            <span data-field="results.chip">{data.chip}</span>
          </div>
          <TitleTag
            className="results-title"
            data-field="results.title"
            data-style-field="results.editor.nodes.title.styles"
            data-tag-field="results.titleTag"
            data-allowed-tags="h2,h3"
          >
            {data.title}
          </TitleTag>
          <p
            className="results-sub"
            data-field="results.subtitle"
            data-style-field="results.editor.nodes.subtitle.styles"
          >
            {data.subtitle}
          </p>
        </div>

        <div className="results-grid">
          {data.items.map((item, index) => (
            <div className="result-card" data-r data-delay={String(index + 1)} key={`${"results-items"}-${item.label}-${index}`}>
              <div
                className="result-stat"
                data-field={`results.items.${index}.stat`}
                data-style-field={`results.editor.nodes.stat_${index}.styles`}
              >
                {item.stat}
              </div>
              <div
                className="result-label"
                data-field={`results.items.${index}.label`}
                data-style-field={`results.editor.nodes.label_${index}.styles`}
              >
                {item.label}
              </div>
              <div
                className="result-desc"
                data-field={`results.items.${index}.description`}
                data-style-field={`results.editor.nodes.description_${index}.styles`}
              >
                {item.description}
              </div>
              <div className="result-client">
                <span
                  className="result-client-badge"
                  data-field={`results.items.${index}.clientBadge`}
                  data-style-field={`results.editor.nodes.clientBadge_${index}.styles`}
                >
                  {item.clientBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
