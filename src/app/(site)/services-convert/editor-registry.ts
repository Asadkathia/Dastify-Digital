import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Results from './components/Results';
import WhySection from './components/WhySection';
import Process from './components/Process';
import Cta from './components/Cta';
import Footer from './components/Footer';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'services-convert',
  defaultContent: defaultContent as unknown as Record<string, unknown>,
  sections: [
    { key: 'nav', label: 'Navigation', icon: '🧭', Component: Navbar as never },
    { key: 'hero', label: 'Hero', icon: '🦸', Component: Hero as never },
    { key: 'services', label: 'Services', icon: '🧩', Component: Services as never },
    { key: 'results', label: 'Results', icon: '📈', Component: Results as never },
    { key: 'why', label: 'Why', icon: '💡', Component: WhySection as never },
    { key: 'process', label: 'Process', icon: '⚙️', Component: Process as never },
    { key: 'cta', label: 'CTA', icon: '🎯', Component: Cta as never },
    { key: 'footer', label: 'Footer', icon: '🏁', Component: Footer as never },
  ],
};

export default registry;

