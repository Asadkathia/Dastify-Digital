type PageContent = import("./types").PageContent;

type ProcessData = PageContent["process"];

export default function DemoProcess({ data }: { data: ProcessData }) {
  const TitleTag = (data.titleTag || "h2") as "h1" | "h2" | "h3" | "h4" | "p" | "span";

  return (
    <section className="process-section">
      <span className="sec-wm g2" data-field="process.watermark">
        {data.watermark}
      </span>
      <div className="wrap">
        <div className="process-header" data-r>
          <div className="chip demo-inline-chip">
            <span className="chip-dot demo-chip-purple"></span>
            <span data-field="process.chip">{data.chip}</span>
          </div>
          <TitleTag
            className="process-title"
            data-field="process.title"
            data-style-field="process.editor.nodes.title.styles"
            data-tag-field="process.titleTag"
            data-allowed-tags="h2,h3"
          >
            {data.title}
          </TitleTag>
          <p
            className="process-sub"
            data-field="process.subtitle"
            data-style-field="process.editor.nodes.subtitle.styles"
          >
            {data.subtitle}
          </p>
        </div>

        <div className="process-timeline">
          {data.steps.map((item, index) => (
            <div className="process-step" data-r data-delay={String(index + 1)} key={`${"process-steps"}-${item.title}-${index}`}>
              <div className="process-step-num" data-field={`process.steps.${index}.number`}>
                {item.number}
              </div>
              <div
                className="process-step-title"
                data-field={`process.steps.${index}.title`}
                data-style-field={`process.editor.nodes.stepTitle_${index}.styles`}
              >
                {item.title}
              </div>
              <div
                className="process-step-desc"
                data-field={`process.steps.${index}.description`}
                data-style-field={`process.editor.nodes.stepDescription_${index}.styles`}
              >
                {item.description}
              </div>
              <div
                className="process-step-time"
                data-field={`process.steps.${index}.time`}
                data-style-field={`process.editor.nodes.stepTime_${index}.styles`}
              >
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
