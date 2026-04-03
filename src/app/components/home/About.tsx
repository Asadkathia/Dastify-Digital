import type { HomepageContent } from '@/lib/homepage-content';
import { CmsImage } from '@/components/CmsImage';

type AboutProps = {
  data: HomepageContent['about'];
};

export function About({ data }: AboutProps) {
  return (
    <section className="about sp" id={data.id}>
      <span className="sec-wm g2">A</span>
      <div className="wrap">
        <div className="about-grid">
          <div className="img-reveal about-img-wrap" data-r="L">
            <CmsImage src={data.image} alt={data.imageAlt} objectFit="contain" />
          </div>
          <div>
            <div className="about-chip-lt" data-r data-delay="1">
              <span className="chip">
                <span className="chip-dot" />
                {data.chip}
              </span>
            </div>
            <h2 className="about-h2" data-r data-delay="2">
              {data.headingLines.map((line) => (
                <span key={line.text} className="line-wrap">
                  <span
                    className="line-inner"
                    data-delay={line.delay}
                    style={line.colorVar ? { color: line.colorVar } : undefined}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h2>
            <p className="about-p" data-r data-delay="3">
              {data.paragraphs[0]}
            </p>
            <p className="about-p" data-r data-delay="3" style={{ marginTop: '-16px' }}>
              {data.paragraphs[1]}
            </p>
            <div data-r data-delay="4">
              <button className="btn-ol" type="button">
                {data.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
