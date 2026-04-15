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
    { key: 'hero', label: 'Hero', icon: '🦸', className: 'svc-convert-hero', Component: Hero as never },
    { key: 'services', label: 'Services', icon: '🧩', className: 'svc-convert-services', Component: Services as never },
    { key: 'results', label: 'Results', icon: '📈', className: 'svc-convert-results', Component: Results as never },
    { key: 'why', label: 'Why', icon: '💡', className: 'svc-convert-why', Component: WhySection as never },
    { key: 'process', label: 'Process', icon: '⚙️', className: 'svc-convert-process', Component: Process as never },
    { key: 'cta', label: 'CTA', icon: '🎯', className: 'svc-convert-cta', Component: Cta as never },
    { key: 'footer', label: 'Footer', icon: '🏁', className: 'svc-convert-footer', Component: Footer as never },
  ],
};

export default registry;

