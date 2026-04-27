import Hero from './components/Hero';
import MissionVision from './components/MissionVision';
import CoreValues from './components/CoreValues';
import Stats from './components/Stats';
import Timeline from './components/Timeline';
import Trust from './components/Trust';
import Certifications from './components/Certifications';
import FinalCta from './components/FinalCta';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'about',
  defaultContent,
  sections: [
    { key: 'hero',           label: 'Hero',             icon: '🦸', className: 'ab2-hero',     Component: Hero as never },
    { key: 'missionVision',  label: 'Mission & Vision', icon: '🎯', className: 'ab2-mv',       Component: MissionVision as never },
    { key: 'coreValues',     label: 'Core Values',      icon: '💎', className: 'ab2-values',   Component: CoreValues as never },
    { key: 'stats',          label: 'Stats',            icon: '📈', className: 'ab2-stats',    Component: Stats as never },
    { key: 'timeline',       label: 'Timeline',         icon: '🕰️', className: 'ab2-timeline', Component: Timeline as never },
    { key: 'trust',          label: 'Trust',            icon: '🛡️', className: 'ab2-trust',    Component: Trust as never },
    { key: 'certifications', label: 'Certifications',   icon: '✅', className: 'ab2-certs',    Component: Certifications as never },
    { key: 'finalCta',       label: 'Final CTA',        icon: '📢', className: 'ab2-cta',      Component: FinalCta as never },
  ],
};

export default registry;
