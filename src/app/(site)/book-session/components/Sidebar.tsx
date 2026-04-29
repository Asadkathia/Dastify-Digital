import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

type IconName = 'check' | 'bolt' | 'calendar' | 'phone';
const KNOWN: IconName[] = ['check', 'bolt', 'calendar', 'phone'];

function resolveIcon(name: string): IconName {
  return (KNOWN as string[]).includes(name) ? (name as IconName) : 'check';
}

export default function Sidebar({ data }: { data: PageContent['sidebar'] }) {
  return (
    <aside className="bk2-sidebar">
      {data.cards.map((card, i) => {
        const titleB = getConvertedNodeBinding(data, { field: `cards.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
        const TitleTag = titleB.Tag;
        if (card.kind === 'list') {
          return (
            <div key={i} className="bk2-info-card">
              <TitleTag {...titleB.props} className="bk2-info-card__title">{card.title}</TitleTag>
              <ul className="bk2-expect">
                {card.items.map((item, j) => {
                  const tB = getConvertedNodeBinding(data, { field: `cards.${i}.items.${j}.text`, defaultTag: 'span' });
                  const TTag = tB.Tag;
                  const iconB = getConvertedImageBinding(data, { field: `cards.${i}.items.${j}.icon`, defaultAlt: item.text });
                  return (
                    <li key={j}>
                      <span {...iconB.props} hidden aria-hidden="true" data-binding-only="true" />
                      <Icon name={resolveIcon(item.icon)} size={16} />
                      <TTag {...tB.props}>{item.text}</TTag>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }
        if (card.kind === 'note') {
          const bB = getConvertedNodeBinding(data, { field: `cards.${i}.body`, defaultTag: 'p' });
          const BTag = bB.Tag;
          return (
            <div key={i} className="bk2-info-card">
              <TitleTag {...titleB.props} className="bk2-info-card__title">{card.title}</TitleTag>
              <BTag {...bB.props} className="bk2-info-card__body">{card.body}</BTag>
            </div>
          );
        }
        // call
        const bB = getConvertedNodeBinding(data, { field: `cards.${i}.body`, defaultTag: 'p' });
        const BTag = bB.Tag;
        const phB = getConvertedNodeBinding(data, { field: `cards.${i}.phoneLabel`, defaultTag: 'span' });
        const PhTag = phB.Tag;
        return (
          <div key={i} className="bk2-info-card">
            <TitleTag {...titleB.props} className="bk2-info-card__title">{card.title}</TitleTag>
            <BTag {...bB.props} className="bk2-info-card__body bk2-info-card__body--mb">{card.body}</BTag>
            <a className="bk2-btn bk2-btn--secondary bk2-btn--md bk2-btn--block" href={card.phoneHref}>
              <Icon name="bolt" size={16} />
              <PhTag {...phB.props}>{card.phoneLabel}</PhTag>
            </a>
          </div>
        );
      })}
    </aside>
  );
}
