import type { HomepageContent } from '@/lib/homepage-content';
import { FaqAccordion } from './FaqAccordion';

type FaqProps = {
  data: HomepageContent['faq'];
};

export function Faq({ data }: FaqProps) {
  const [titleTop, titleBottom] = data.title.split('\n');

  return (
    <section className="faq sp" id={data.id}>
      <span className="sec-wm g2">?</span>
      <div className="wrap">
        <div className="faq-grid">
          <div>
            <div data-r>
              <span className="chip">
                <span className="chip-dot" />
                {data.chip}
              </span>
            </div>
            <h2 className="faq-h2" data-r data-delay="1">
              {titleTop}
              <br />
              {titleBottom}
            </h2>
            <p className="faq-intro" data-r data-delay="2">
              {data.intro}
            </p>
            <div style={{ marginTop: '36px' }} data-r data-delay="3">
              <button className="btn-pu" type="button">
                {data.cta}
              </button>
            </div>
          </div>
          <FaqAccordion items={data.items} />
        </div>
      </div>
    </section>
  );
}
