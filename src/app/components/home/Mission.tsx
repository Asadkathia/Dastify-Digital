import type { HomepageContent } from '@/lib/homepage-content';

type MissionProps = {
  data: HomepageContent['mission'];
};

export function Mission({ data }: MissionProps) {
  const [firstLine, secondLine] = data.title.split('\n');

  return (
    <section className="mission">
      <span className="sec-wm g3">M</span>
      <div className="mission-grid">
        <div className="mission-img img-reveal" data-r="L">
          <img src={data.image} alt={data.imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div className="mission-content">
          <div data-r>
            <span className="chip">
              <span className="chip-dot" />
              {data.chip}
            </span>
          </div>
          <h3 className="mission-h3" data-r data-delay="1">
            {firstLine}
            <br />
            {secondLine}
          </h3>
          <p className="mission-p" data-r data-delay="2">
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
            <button className="btn-pu" type="button">
              {data.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
