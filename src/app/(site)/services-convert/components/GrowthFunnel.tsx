import type { PageContent } from '../content';
import HomeGrowthFunnel from '../../home/components/GrowthFunnel';

export default function GrowthFunnel({ data }: { data: PageContent['growthFunnel'] }) {
  return <HomeGrowthFunnel data={data} />;
}
