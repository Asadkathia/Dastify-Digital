import type { HomepageContent } from '@/lib/homepage-content';
import { BrandAcronymSvg } from './BrandAcronymSvg';

type BrandAcronymProps = {
  data: HomepageContent['brandAcronym'];
};

export function BrandAcronym({ data }: BrandAcronymProps) {
  return (
    <section className="bai-sec" id={data.id}>
      <div className="wrap bai-head" data-r>
        <span className="chip">
          <span className="chip-dot" />
          {data.chip}
        </span>
        <h2 className="bai-title">{data.title}</h2>
        <p className="bai-sub">{data.subtitle}</p>
      </div>
      <div className="bai-wrap">
        <BrandAcronymSvg items={data.items} />
      </div>
    </section>
  );
}
