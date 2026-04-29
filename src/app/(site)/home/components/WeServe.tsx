import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from './_icons';

const TONE_PALETTE = ['primary', 'accent', 'support'] as const;
type Tone = (typeof TONE_PALETTE)[number] | null;
function toneForIndex(i: number): Tone {
  if (i % 2 !== 0) return null;
  return TONE_PALETTE[Math.floor(i / 2) % TONE_PALETTE.length];
}

export default function WeServe({ data }: { data: HomepageContent['weServe'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
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
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">
            {data.titleLead}
            <br />
            of <TitleEmTag {...titleEm.props}>{data.titleEm.replace(/^of\s+/i, '')}</TitleEmTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>
        <div className="hp2-weserve__grid">
          {data.specialties.map((s, i) => {
            const nameB = getConvertedNodeBinding(data, { field: `specialties.${i}.name`, defaultTag: 'span' });
            const NameTag = nameB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `specialties.${i}.icon`, defaultAlt: s.name });
            const tone = toneForIndex(i);
            return (
              <div key={i} className="hp2-weserve__card" data-tone={tone ?? undefined}>
                <div className="hp2-weserve__icon" {...iconB.props}>
                  <Icon name={s.icon as IconName} size={20} />
                </div>
                <NameTag {...nameB.props}>{s.name}</NameTag>
              </div>
            );
          })}
        </div>
        <p className="hp2-weserve__note">
          <NoteLeadTag {...noteLead.props}>{data.noteLead}</NoteLeadTag>{' '}
          {/* IA route — label editable, href fixed */}
          <a href="/contact" className="hp2-weserve__note-link">
            <NoteLinkTag {...noteLink.props}>{data.noteLink}</NoteLinkTag>
          </a>
        </p>
      </div>
    </section>
  );
}
