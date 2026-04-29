import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';

export default function Results({ data }: { data: HomepageContent['results'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleTail = getConvertedNodeBinding(data, { field: 'titleTail', defaultTag: 'span' });
  const TitleTailTag = titleTail.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;

  return (
    <section className="hp2-proof">
      <div className="hp2-wrap">
        <div className="hp2-proof__grid">
          {/* ── Left column: copy + CTA ── */}
          <div className="hp2-proof__copy">
            <EyebrowTag {...eyebrow.props} className="hp2-proof__eyebrow">
              <span className="hp2-proof__eyebrow-dot" aria-hidden="true" />
              {data.eyebrow}
            </EyebrowTag>
            <TitleTag {...title.props} className="hp2-proof__title">
              {data.titleLead}
              <br />
              <TitleTailTag {...titleTail.props}>{data.titleTail}</TitleTailTag>
            </TitleTag>
            <IntroTag {...intro.props} className="hp2-proof__intro">{data.intro}</IntroTag>
            <Link href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--lg hp2-proof__cta">
              <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          {/* ── Right column: KPI tiles over world-map backdrop ── */}
          <div className="hp2-proof__kpis">
            <div
              className="hp2-proof__map"
              aria-hidden="true"
              style={{ backgroundImage: "url('/proof-bg.svg')" }}
            />
            <div className="hp2-proof__kpi-grid">
              {data.cards.map((c, i) => {
                const clientB = getConvertedNodeBinding(data, { field: `cards.${i}.client`, defaultTag: 'div' });
                const CTag = clientB.Tag;
                const valueB = getConvertedNodeBinding(data, { field: `cards.${i}.value`, defaultTag: 'div' });
                const VTag = valueB.Tag;
                const labelB = getConvertedNodeBinding(data, { field: `cards.${i}.label`, defaultTag: 'span' });
                const LTag = labelB.Tag;
                return (
                  <div key={i} className="hp2-proof__kpi">
                    <CTag {...clientB.props} className="hp2-proof__kpi-client">{c.client}</CTag>
                    <VTag {...valueB.props} className="hp2-proof__kpi-value">{c.value}</VTag>
                    <LTag {...labelB.props} className="hp2-proof__kpi-chip">{c.label}</LTag>
                    {c.subStats?.map((ss, j) => {
                      const ssvB = getConvertedNodeBinding(data, { field: `cards.${i}.subStats.${j}.value`, defaultTag: 'span' });
                      const SVT = ssvB.Tag;
                      const sslB = getConvertedNodeBinding(data, { field: `cards.${i}.subStats.${j}.label`, defaultTag: 'span' });
                      const SLT = sslB.Tag;
                      return (
                        <span key={j} hidden>
                          <SVT {...ssvB.props}>{ss.value}</SVT>
                          <SLT {...sslB.props}>{ss.label}</SLT>
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
