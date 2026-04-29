import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

type IconName = 'phone' | 'calendar' | 'search' | 'bolt' | 'check' | 'arrow';

const KNOWN: IconName[] = ['phone', 'calendar', 'search', 'bolt', 'check', 'arrow'];

function resolveIcon(name: string): IconName {
  return (KNOWN as string[]).includes(name) ? (name as IconName) : 'bolt';
}

export default function Info({ data: main }: { data: PageContent['main'] }) {
  const data = main.info;
  const { contact, office, social } = data;
  const contactTitle = getConvertedNodeBinding(main, { field: 'info.contact.title', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const ContactTitleTag = contactTitle.Tag;
  const officeTitle = getConvertedNodeBinding(main, { field: 'info.office.title', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const OfficeTitleTag = officeTitle.Tag;
  const address = getConvertedNodeBinding(main, { field: 'info.office.address', defaultTag: 'p' });
  const AddressTag = address.Tag;
  const socialTitle = getConvertedNodeBinding(main, { field: 'info.social.title', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const SocialTitleTag = socialTitle.Tag;
  return (
    <aside className="ct2-sidebar">
      <div className="ct2-info-card">
        <ContactTitleTag {...contactTitle.props} className="ct2-info-card__title">{contact.title}</ContactTitleTag>
        {contact.items.map((item, i) => {
          const labelB = getConvertedNodeBinding(main, { field: `info.contact.items.${i}.label`, defaultTag: 'b' });
          const LabelTag = labelB.Tag;
          const valueB = getConvertedNodeBinding(main, { field: `info.contact.items.${i}.value`, defaultTag: 'span' });
          const ValueTag = valueB.Tag;
          return (
            <div key={i} className="ct2-info__row">
              <Icon name={resolveIcon(item.icon)} size={18} />
              <div>
                <LabelTag {...labelB.props}>{item.label}</LabelTag>
                <ValueTag {...valueB.props}>{item.value}</ValueTag>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ct2-info-card">
        <OfficeTitleTag {...officeTitle.props} className="ct2-info-card__title">{office.title}</OfficeTitleTag>
        {(() => {
          const mapImg = getConvertedImageBinding(main, {
            field: 'info.office.mapImage',
            altField: 'info.office.mapAlt',
            defaultAlt: office.mapAlt,
          });
          return mapImg.hasImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              {...mapImg.props}
              src={mapImg.src}
              alt={mapImg.alt || office.mapAlt}
              className="ct2-map"
            />
          ) : (
            <div {...mapImg.props} className="ct2-map ct2-map--placeholder iph" aria-label={office.mapAlt}>
              <span>{office.mapAlt}</span>
            </div>
          );
        })()}
        <AddressTag {...address.props} className="ct2-address">
          {office.address.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </AddressTag>
      </div>

      <div className="ct2-info-card">
        <SocialTitleTag {...socialTitle.props} className="ct2-info-card__title">{social.title}</SocialTitleTag>
        <div className="ct2-social">
          {social.links.map((s, i) => {
            const lB = getConvertedNodeBinding(main, { field: `info.social.links.${i}.label`, defaultTag: 'span' });
            const LTag = lB.Tag;
            return (
              <a key={s.label} href={s.href} className="ct2-social__link">
                <LTag {...lB.props}>{s.label}</LTag>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
