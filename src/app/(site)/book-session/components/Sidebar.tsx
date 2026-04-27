import type { SidebarData } from '../content';
import { Icon } from '../../home/components/_icons';

type IconName = 'check' | 'bolt' | 'calendar' | 'phone';
const KNOWN: IconName[] = ['check', 'bolt', 'calendar', 'phone'];

function resolveIcon(name: string): IconName {
  return (KNOWN as string[]).includes(name) ? (name as IconName) : 'check';
}

export default function Sidebar({ data }: { data: SidebarData }) {
  return (
    <aside className="bk2-sidebar">
      {data.cards.map((card, i) => {
        if (card.kind === 'list') {
          return (
            <div key={i} className="bk2-info-card">
              <h4 className="bk2-info-card__title">{card.title}</h4>
              <ul className="bk2-expect">
                {card.items.map((item, j) => (
                  <li key={j}>
                    <Icon name={resolveIcon(item.icon)} size={16} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (card.kind === 'note') {
          return (
            <div key={i} className="bk2-info-card">
              <h4 className="bk2-info-card__title">{card.title}</h4>
              <p className="bk2-info-card__body">{card.body}</p>
            </div>
          );
        }
        // call
        return (
          <div key={i} className="bk2-info-card">
            <h4 className="bk2-info-card__title">{card.title}</h4>
            <p className="bk2-info-card__body bk2-info-card__body--mb">{card.body}</p>
            <a className="bk2-btn bk2-btn--secondary bk2-btn--md bk2-btn--block" href={card.phoneHref}>
              <Icon name="bolt" size={16} />
              <span>{card.phoneLabel}</span>
            </a>
          </div>
        );
      })}
    </aside>
  );
}
