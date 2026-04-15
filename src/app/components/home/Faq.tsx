import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { FaqAccordion } from './FaqAccordion';

type FaqProps = {
  data: HomepageContent['faq'];
};

export function Faq({ data }: FaqProps) {
  const [titleTop, titleBottom] = data.title.split('\n');
  const ctaHref = data.ctaHref?.url || null;

  return (
    <section className="faq sp" id={data.id}>
      <span className="sec-wm g2">?</span>
      <div className="wrap">
        <div className="faq-grid">
          <div>
            <div data-r>
              <span className="chip">
                <span className="chip-dot" />
                <span data-field="chip">{data.chip}</span>
              </span>
            </div>
            <h2 className="faq-h2" data-r data-delay="1" data-field="title">
              {titleTop}
              <br />
              {titleBottom}
            </h2>
            <p className="faq-intro" data-r data-delay="2" data-field="intro">
              {data.intro}
            </p>
            <div style={{ marginTop: '36px' }} data-r data-delay="3">
              {ctaHref ? (
                <Link
                  className="btn-pu"
                  href={ctaHref}
                  target={data.ctaHref?.openInNewTab ? '_blank' : undefined}
                  rel={data.ctaHref?.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  <span data-field="cta">{data.cta}</span>
                </Link>
              ) : (
                <button className="btn-pu" type="button">
                  <span data-field="cta">{data.cta}</span>
                </button>
              )}
            </div>
          </div>
          <FaqAccordion items={data.items} />
        </div>
      </div>
    </section>
  );
}
