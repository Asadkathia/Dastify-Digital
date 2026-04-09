import AboutNavbar from './components/AboutNavbar';
import AboutHero from './components/AboutHero';
import AboutManifesto from './components/AboutManifesto';
import AboutDifference from './components/AboutDifference';
import AboutStory from './components/AboutStory';
import AboutTeam from './components/AboutTeam';
import AboutValues from './components/AboutValues';
import AboutCta from './components/AboutCta';
import AboutFooter from './components/AboutFooter';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'about',
  defaultContent: defaultContent as unknown as Record<string, unknown>,
  sections: [
    { key: 'nav', label: 'Navigation', icon: '🧭', Component: AboutNavbar as never },
    { key: 'hero', label: 'Hero', icon: '🦸', Component: AboutHero as never },
    { key: 'manifesto', label: 'Manifesto', icon: '📣', Component: AboutManifesto as never },
    { key: 'difference', label: 'Difference', icon: '✨', Component: AboutDifference as never },
    { key: 'story', label: 'Story', icon: '🕰️', Component: AboutStory as never },
    { key: 'team', label: 'Team', icon: '👥', Component: AboutTeam as never },
    { key: 'values', label: 'Values', icon: '💎', Component: AboutValues as never },
    { key: 'cta', label: 'CTA', icon: '🎯', Component: AboutCta as never },
    { key: 'footer', label: 'Footer', icon: '🏁', Component: AboutFooter as never },
  ],
};

export default registry;

