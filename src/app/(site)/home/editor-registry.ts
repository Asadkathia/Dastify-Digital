import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Services from './components/Services';
import Results from './components/Results';
import Testimonial from './components/Testimonial';
import WeServe from './components/WeServe';
import AboutPreview from './components/AboutPreview';
import Pricing from './components/Pricing';
import BlogPreview from './components/BlogPreview';
import FinalCta from './components/FinalCta';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

// v2 Homepage — ten sections in render order, each className matches the
// rendered root class so Section Style overrides resolve correctly.
const registry: ConvertedPageRegistry = {
  pageName: 'home',
  defaultContent,
  sections: [
    { key: 'hero',         label: 'Hero',          icon: '🦸', className: 'hp2-hero',        Component: Hero as never },
    { key: 'trustBar',     label: 'Trust Bar',     icon: '🛡️', className: 'hp2-trustbar',    Component: TrustBar as never },
    { key: 'services',     label: 'Services',      icon: '🧩', className: 'hp2-services',    Component: Services as never },
    { key: 'results',      label: 'Results',       icon: '📈', className: 'hp2-results',     Component: Results as never },
    { key: 'testimonial',  label: 'Testimonial',   icon: '💬', className: 'hp2-testimonial', Component: Testimonial as never },
    { key: 'weServe',      label: 'We Serve',      icon: '🩺', className: 'hp2-weserve',     Component: WeServe as never },
    { key: 'aboutPreview', label: 'About Preview', icon: '📖', className: 'hp2-about',       Component: AboutPreview as never },
    { key: 'pricing',      label: 'Pricing',       icon: '💰', className: 'hp2-pricing',     Component: Pricing as never },
    { key: 'blogPreview',  label: 'Blog Preview',  icon: '📰', className: 'hp2-blog',        Component: BlogPreview as never },
    { key: 'finalCta',     label: 'Final CTA',     icon: '📢', className: 'hp2-final',       Component: FinalCta as never },
  ],
};

export default registry;
