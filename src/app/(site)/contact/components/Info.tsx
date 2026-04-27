import type { InfoData } from '../content';
import { Icon } from '../../home/components/_icons';

type IconName = 'phone' | 'calendar' | 'search' | 'bolt' | 'check' | 'arrow';

const KNOWN: IconName[] = ['phone', 'calendar', 'search', 'bolt', 'check', 'arrow'];

function resolveIcon(name: string): IconName {
  return (KNOWN as string[]).includes(name) ? (name as IconName) : 'bolt';
}

export default function Info({ data }: { data: InfoData }) {
  const { contact, office, social } = data;
  return (
    <aside className="ct2-sidebar">
      <div className="ct2-info-card">
        <h4 className="ct2-info-card__title">{contact.title}</h4>
        {contact.items.map((item, i) => (
          <div key={i} className="ct2-info__row">
            <Icon name={resolveIcon(item.icon)} size={18} />
            <div>
              <b>{item.label}</b>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ct2-info-card">
        <h4 className="ct2-info-card__title">{office.title}</h4>
        {office.mapImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={office.mapImage}
            alt={office.mapAlt}
            className="ct2-map"
          />
        ) : (
          // TODO(assets): supply real map image at public/contact/office-map.jpg
          <div className="ct2-map ct2-map--placeholder iph" aria-label={office.mapAlt}>
            <span>{office.mapAlt}</span>
          </div>
        )}
        <p className="ct2-address">
          {office.address.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      </div>

      <div className="ct2-info-card">
        <h4 className="ct2-info-card__title">{social.title}</h4>
        <div className="ct2-social">
          {social.links.map((s) => (
            <a key={s.label} href={s.href} className="ct2-social__link">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
