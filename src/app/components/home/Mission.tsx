import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { CmsImage } from '@/components/CmsImage';

type MissionProps = {
  data: HomepageContent['mission'];
};

export function Mission({ data }: MissionProps) {
  const [firstLine, secondLine] = data.title.split('\n');
  const ctaHref = data.ctaHref?.url || null;

  return (
    <section className="mission">
      <span className="sec-wm g3">M</span>
      <div className="mission-grid">
        <div className="mission-img img-reveal" data-r="L">
          <CmsImage src={data.image} alt={data.imageAlt} objectFit="cover" />
        </div>
        <div className="mission-content">
          <div data-r>
            <span className="chip">
              <span className="chip-dot" />
              <span data-field="chip">{data.chip}</span>
            </span>
          </div>
          <h3 className="mission-h3" data-r data-delay="1" data-field="title">
            {firstLine}
            <br />
            {secondLine}
          </h3>
          <p className="mission-p" data-r data-delay="2" data-field="description">
            {data.description}
          </p>
          <div className="mission-checks" data-r data-delay="3">
            {data.checks.map((check) => (
              <div key={check} className="mission-check">
                <div className="mission-check-ic">✓</div>
                {check}
              </div>
            ))}
          </div>
          <div data-r data-delay="4">
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
      </div>
    </section>
  );
}
