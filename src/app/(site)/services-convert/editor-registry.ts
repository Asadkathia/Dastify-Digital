import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import Comparison from './components/Comparison';
import WhyDifferent from './components/WhyDifferent';
import Formula from './components/Formula';
import SetsApart from './components/SetsApart';
import Process from './components/Process';
import CtaBanner from './components/CtaBanner';
import Specialties from './components/Specialties';
import Faqs from './components/Faqs';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'services-convert',
  defaultContent,
  sections: [
    { key: 'hero',         label: 'Hero',           icon: '🦸', className: 'sv2-hero',        Component: Hero as never },
    { key: 'stats',        label: 'Stats Bar',      icon: '📊', className: 'sv2-stats',       Component: StatsBar as never },
    { key: 'comparison',   label: 'Comparison',     icon: '⚖️', className: 'sv2-comparison',  Component: Comparison as never },
    { key: 'whyDifferent', label: 'Why Different',  icon: '💡', className: 'sv2-why',         Component: WhyDifferent as never },
    { key: 'formula',      label: 'Formula',        icon: '✨', className: 'sv2-formula',     Component: Formula as never },
    { key: 'setsApart',    label: 'Sets Us Apart',  icon: '🏆', className: 'sv2-apart',       Component: SetsApart as never },
    { key: 'process',      label: 'Process',        icon: '⚙️', className: 'sv2-process',     Component: Process as never },
    { key: 'ctaBanner',    label: 'CTA Banner',     icon: '📢', className: 'sv2-cta-banner',  Component: CtaBanner as never },
    { key: 'specialties',  label: 'Specialties',    icon: '🩺', className: 'sv2-specs',       Component: Specialties as never },
    { key: 'faqs',         label: 'FAQs',           icon: '❓', className: 'sv2-faqs',        Component: Faqs as never },
  ],
};

export default registry;
