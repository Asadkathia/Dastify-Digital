import AboutHero from './components/AboutHero';
import AboutManifesto from './components/AboutManifesto';
import AboutDifference from './components/AboutDifference';
import AboutStory from './components/AboutStory';
import AboutTeam from './components/AboutTeam';
import AboutValues from './components/AboutValues';
import AboutCta from './components/AboutCta';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'about',
  defaultContent,
  sections: [
    { key: 'hero', label: 'Hero', icon: '🦸', className: 'about-hero', Component: AboutHero as never },
    { key: 'manifesto', label: 'Manifesto', icon: '📣', className: 'about-manifesto', Component: AboutManifesto as never },
    { key: 'difference', label: 'Difference', icon: '✨', className: 'about-difference', Component: AboutDifference as never },
    { key: 'story', label: 'Story', icon: '🕰️', className: 'about-story', Component: AboutStory as never },
    { key: 'team', label: 'Team', icon: '👥', className: 'about-team', Component: AboutTeam as never },
    { key: 'values', label: 'Values', icon: '💎', className: 'about-values', Component: AboutValues as never },
    { key: 'cta', label: 'CTA', icon: '🎯', className: 'about-cta-close', Component: AboutCta as never },
  ],
};

export default registry;

