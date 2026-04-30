import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from './_icons';

/**
 * "Our Medical Specialties Of Focus" section.
 *
 * Renders a single asymmetric grid (4 cols × 3 rows on desktop) where exactly
 * one item is variant: 'featured' (large dark-indigo tile spanning 2×2) and
 * the rest are variant: 'compact' light-lavender tiles. Order in the rendered
 * grid follows array order; placement is driven purely by CSS (no sub-grids,
 * no `order:` tricks) so JSX order matches DOM order at every breakpoint.
 *
 * Editor model: every editable text node uses a stable id-based field path
 * (`specialties.<i>.title|label`) so inline edits survive reorders. The
 * featured card's image slot is keyed off `specialties.0.image`. Compact items
 * intentionally have no image binding — the editor adapter only generates
 * an upload control for slots present in the data shape.
 */
export default function WeServe({ data }: { data: HomepageContent['weServe'] }) {
  const title = getConvertedNodeBinding(data, {
    field: 'titleLead',
    defaultTag: 'h2',
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'],
  });
  const TitleTag = title.Tag;
  const titleEm = getConvertedNodeBinding(data, { field: 'titleEm', defaultTag: 'em' });
  const TitleEmTag = titleEm.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const noteLead = getConvertedNodeBinding(data, { field: 'noteLead', defaultTag: 'span' });
  const NoteLeadTag = noteLead.Tag;
  const noteLink = getConvertedNodeBinding(data, { field: 'noteLink', defaultTag: 'span' });
  const NoteLinkTag = noteLink.Tag;

  return (
    <section className="hp2-weserve">
      <div className="hp2-wrap">
        <div className="hp2-section-head hp2-section-head--center">
          <TitleTag className="hp2-h2">
            <span {...title.props}>{data.titleLead}</span>
            <br />
            of <TitleEmTag {...titleEm.props}>{data.titleEm.replace(/^of\s+/i, '')}</TitleEmTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
          {/* Relocated CTA: directly under subtitle, above the grid. */}
          <p className="hp2-weserve__note hp2-weserve__note--top">
            <NoteLeadTag {...noteLead.props}>{data.noteLead}</NoteLeadTag>{' '}
            <Link href="/contact" className="hp2-weserve__note-link">
              <NoteLinkTag {...noteLink.props}>{data.noteLink}</NoteLinkTag>
            </Link>
          </p>
        </div>
        <ul className="hp2-weserve__grid" role="list">
          {data.specialties.map((rawItem, i) => {
            // Defensive normalization: legacy DB overrides predate the
            // featured/compact data model and may lack `variant`, `label`, or
            // `id`. Default to compact + derived label so a stale Pages record
            // still renders correctly until marketing re-saves it.
            const s = {
              id: rawItem.id ?? `legacy-${i}`,
              variant: rawItem.variant === 'featured' ? 'featured' as const : 'compact' as const,
              label: rawItem.label ?? `Service ${String(i + 1).padStart(2, '0')}`,
              icon: rawItem.icon,
              name: rawItem.name,
              image: rawItem.image,
              imageAlt: rawItem.imageAlt,
            };
            const labelB = getConvertedNodeBinding(data, {
              field: `specialties.${i}.label`,
              defaultTag: 'span',
              nodeKey: `specialty-${s.id}-label`,
            });
            const LabelTag = labelB.Tag;
            const nameB = getConvertedNodeBinding(data, {
              field: `specialties.${i}.name`,
              defaultTag: 'span',
              nodeKey: `specialty-${s.id}-name`,
            });
            const NameTag = nameB.Tag;
            const isFeatured = s.variant === 'featured';
            // Bind imageAlt independently so the lint sees it covered and the
            // editor adapter generates a text input for it. The image binding's
            // altField points at the same path (specialties.<i>.imageAlt).
            if (isFeatured) {
              getConvertedNodeBinding(data, {
                field: `specialties.${i}.imageAlt`,
                defaultTag: 'span',
                nodeKey: `specialty-${s.id}-imageAlt`,
              });
            }
            const imageB = isFeatured
              ? getConvertedImageBinding(data, {
                  field: `specialties.${i}.image`,
                  altField: `specialties.${i}.imageAlt`,
                  defaultAlt: s.imageAlt ?? s.name,
                  nodeKey: `specialty-${s.id}-image`,
                })
              : null;
            return (
              <li
                key={s.id}
                className={`hp2-weserve__card hp2-weserve__card--${s.variant}`}
                data-id={s.id}
              >
                {isFeatured ? (
                  <>
                    <div className="hp2-weserve__featured-head">
                      <LabelTag
                        {...labelB.props}
                        className="hp2-weserve__label hp2-weserve__label--on-dark"
                      >
                        {s.label}
                      </LabelTag>
                      <NameTag
                        {...nameB.props}
                        className="hp2-weserve__title hp2-weserve__title--featured"
                      >
                        {s.name}
                      </NameTag>
                    </div>
                    <div className="hp2-weserve__featured-media" {...(imageB?.props ?? {})}>
                      {imageB?.hasImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageB.src} alt={imageB.alt} />
                      ) : (
                        <div className="iph hp2-weserve__featured-iph" aria-label={imageB?.alt ?? s.name}>
                          <span>Hero image</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hp2-weserve__icon">
                      <Icon name={s.icon as IconName} size={22} />
                    </div>
                    <LabelTag {...labelB.props} className="hp2-weserve__label">
                      {s.label}
                    </LabelTag>
                    <NameTag {...nameB.props} className="hp2-weserve__title">
                      {s.name}
                    </NameTag>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
