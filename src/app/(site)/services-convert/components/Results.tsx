import { getConvertedNodeBinding } from "@/components/converted-editor";

type ResultsData = {
  headline: string;
  stats: { value: string; label: string }[];
};

export default function Results({ data }: { data: ResultsData }) {
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const headlineNode = getConvertedNodeBinding(data, { field: 'headline', defaultTag: 'h2', nodeKey: 'headline', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadlineTag = headlineNode.Tag;
  return (
    <section className="svc-convert-results">
      <div className="wrap">
        <div className="svc-convert-results-inner">
          <HeadlineTag className="svc-convert-results-headline" data-r {...headlineNode.props}>
            {data.headline}
          </HeadlineTag>
          {stats.map((stat, index) => (
            <div key={stat.label} className="svc-convert-results-stat" data-r data-delay={String(index + 1)}>
              <div className="svc-convert-stat-num" {...getConvertedNodeBinding(data, { field: `stats.${index}.value`, defaultTag: 'div', nodeKey: `stats_${index}_value` }).props}>{stat.value}</div>
              <div className="svc-convert-stat-lbl" {...getConvertedNodeBinding(data, { field: `stats.${index}.label`, defaultTag: 'div', nodeKey: `stats_${index}_label` }).props}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
