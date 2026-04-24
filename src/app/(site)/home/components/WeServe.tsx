import type { HomepageContent } from '@/lib/homepage-content';
import { Icon, type IconName } from './_icons';

export default function WeServe({ data }: { data: HomepageContent['weServe'] }) {
  return (
    <section className="hp2-weserve">
      <div className="hp2-wrap">
        <div className="hp2-section-head hp2-section-head--center">
          <div className="hp2-eyebrow">{data.eyebrow}</div>
          <h2 className="hp2-h2">
            {data.titleLead}
            <br />
            of <em>{data.titleEm.replace(/^of\s+/i, '')}</em>
          </h2>
          <p className="hp2-intro">{data.intro}</p>
        </div>
        <div className="hp2-weserve__grid">
          {data.specialties.map((s, i) => (
            <div key={i} className="hp2-weserve__card">
              <div className="hp2-weserve__icon">
                <Icon name={s.icon as IconName} size={20} />
              </div>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
        <p className="hp2-weserve__note">
          {data.noteLead}{' '}
          <a href="/contact" className="hp2-weserve__note-link">
            {data.noteLink}
          </a>
        </p>
      </div>
    </section>
  );
}
