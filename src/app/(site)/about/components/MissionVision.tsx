import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';

export default function MissionVision({ data }: { data: PageContent['missionVision'] }) {
  return (
    <section className="ab2-mv">
      <div className="ab2-wrap">
        <div className="ab2-mv__grid">
          <div className="ab2-mv__card">
            <div className="ab2-mv__icon">
              <Icon name={data.mission.icon as IconName} size={28} />
            </div>
            <h3>{data.mission.title}</h3>
            <p>{data.mission.body}</p>
          </div>
          <div className="ab2-mv__card ab2-mv__card--accent">
            <div className="ab2-mv__icon">
              <Icon name={data.vision.icon as IconName} size={28} />
            </div>
            <h3>{data.vision.title}</h3>
            <p>{data.vision.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
