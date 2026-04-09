type ProcessData = {
  chip: string;
  title: string;
  intro: string;
  steps: { number: string; title: string; description: string }[];
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
          <div className="iph svc-convert-process-iph" data-r data-delay="2">
            <div className="iph-ic">{data.placeholderIcon}</div>
            <span className="iph-lbl">{data.placeholderLabel}</span>
            <span className="iph-dim">{data.placeholderDimensions}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
