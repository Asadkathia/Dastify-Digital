import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';

// Normalize the legacy `string` entry shape into the upgraded `{ label, image }`
// shape so already-saved `convertedContent.trustBar.logos` keeps rendering.
function normalizeLogo(entry: string | { label: string; image?: unknown }): { label: string } {
  if (typeof entry === 'string') return { label: entry };
  return { label: entry.label ?? '' };
}

export default function TrustBar({ data }: { data: HomepageContent['trustBar'] }) {
  const labelNode = getConvertedNodeBinding(data, { field: 'label', defaultTag: 'span' });
  const LabelTag = labelNode.Tag;
  return (
    <section className="hp2-trustbar">
      <div className="hp2-wrap">
        <LabelTag {...labelNode.props} className="hp2-trustbar__label">{data.label}</LabelTag>
        <div className="hp2-trustbar__track">
          {data.logos.map((entry, i) => {
            const { label } = normalizeLogo(entry);
            const labelBinding = getConvertedNodeBinding(data, { field: `logos.${i}.label`, defaultTag: 'span' });
            const LBTag = labelBinding.Tag;
            const imgBinding = getConvertedImageBinding(data, {
              field: `logos.${i}.image`,
              altField: `logos.${i}.label`,
              defaultAlt: label,
            });

            if (imgBinding.hidden) {
              return (
                <div key={i} {...imgBinding.props} data-image-hidden="true" className="hp2-trustbar__logo iph" aria-label={label}>
                  <span>{label}</span>
                </div>
              );
            }

            if (imgBinding.hasImage) {
              return (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  {...imgBinding.props}
                  src={imgBinding.src}
                  alt={imgBinding.alt || label}
                  className="hp2-trustbar__logo hp2-trustbar__logo-img"
                />
              );
            }

            return (
              <div key={i} {...imgBinding.props} className="hp2-trustbar__logo iph" aria-label={label}>
                <LBTag {...labelBinding.props}>{label}</LBTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
