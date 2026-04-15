import type { HomepageContent } from '@/lib/homepage-content';

type CtaProps = {
  data: HomepageContent['cta'];
};

export function Cta({ data }: CtaProps) {
  return (
    <section className="cta-section sp">
      <span className="sec-wm wm-wt">DD</span>
      <div className="wrap">
        <div className="cta-inner">
          <div data-r>
            <span className="chip">
              <span className="chip-dot" />
              <span data-field="chip">{data.chip}</span>
            </span>
          </div>
          <h2 className="cta-h2" data-r data-delay="1">
            {data.headingLines.map((line) => (
              <span key={line.text} className="line-wrap">
                <span
                  className="line-inner"
                  data-delay={line.delay}
                  style={line.color ? { color: line.color } : undefined}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>
          <p className="cta-sub" data-r data-delay="2" data-field="subtitle">
            {data.subtitle}
          </p>
          <div className="cta-form" data-r data-delay="3">
            <input className="cta-input" type="email" placeholder={data.inputPlaceholder} />
            <button className="btn-pu" type="button">
              <span data-field="button">{data.button}</span>
            </button>
          </div>
          <p className="cta-note" data-r data-delay="4" data-field="note">
            {data.note}
          </p>
        </div>
      </div>
    </section>
  );
}
