import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';

export default function MissionVision({ data }: { data: PageContent['missionVision'] }) {
  const mTitle = getConvertedNodeBinding(data, { field: 'mission.title', defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const MTitleTag = mTitle.Tag;
  const mBody = getConvertedNodeBinding(data, { field: 'mission.body', defaultTag: 'p' });
  const MBodyTag = mBody.Tag;
  const vTitle = getConvertedNodeBinding(data, { field: 'vision.title', defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const VTitleTag = vTitle.Tag;
  const vBody = getConvertedNodeBinding(data, { field: 'vision.body', defaultTag: 'p' });
  const VBodyTag = vBody.Tag;
  return (
    <section className="ab2-mv">
      <div className="ab2-wrap">
        <div className="ab2-mv__grid">
          <div className="ab2-mv__card">
            <div className="ab2-mv__icon">
              <Icon name={data.mission.icon as IconName} size={28} />
            </div>
            <MTitleTag {...mTitle.props}>{data.mission.title}</MTitleTag>
            <MBodyTag {...mBody.props}>{data.mission.body}</MBodyTag>
          </div>
          <div className="ab2-mv__card ab2-mv__card--accent">
            <div className="ab2-mv__icon">
              <Icon name={data.vision.icon as IconName} size={28} />
            </div>
            <VTitleTag {...vTitle.props}>{data.vision.title}</VTitleTag>
            <VBodyTag {...vBody.props}>{data.vision.body}</VBodyTag>
          </div>
        </div>
      </div>
    </section>
  );
}
