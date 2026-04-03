import type { HomepageContent } from '@/lib/homepage-content';
import { CmsImage } from '@/components/CmsImage';

type FeatureStripProps = {
  data: HomepageContent['features'];
};

export function FeatureStrip({ data }: FeatureStripProps) {
  return (
    <section className="feat-strip" style={{ position: 'relative' }}>
      <span className="sec-wm g3">F</span>
      <div className="feat-grid">
        {data.cards.map((card, index) => (
          <div key={card.title} className="feat-card img-reveal" data-r={index === 0 ? 'L' : 'R'}>
            <CmsImage src={card.image} alt={card.alt} objectFit="cover" />
            <div className="feat-overlay">
              <div className="feat-cat">{card.category}</div>
              <div className="feat-title">{card.title}</div>
              <div className="feat-desc">{card.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
