import type { HomepageContent } from '@/lib/homepage-content';

export default function TrustBar({ data }: { data: HomepageContent['trustBar'] }) {
  return (
    <section className="hp2-trustbar">
      <div className="hp2-wrap">
        <span className="hp2-trustbar__label">{data.label}</span>
        <div className="hp2-trustbar__track">
          {data.logos.map((l, i) => (
            <div key={i} className="hp2-trustbar__logo">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
