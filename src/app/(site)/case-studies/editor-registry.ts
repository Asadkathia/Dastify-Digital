import Hero from './components/Hero';
import CaseStudiesGrid from './components/CaseStudiesGrid';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'case-studies',
  defaultContent,
  sections: [
    { key: 'hero',         label: 'Hero',          icon: '🦸', className: 'cs2-hero', Component: Hero as never },
    { key: 'caseStudies',  label: 'Case Studies',  icon: '📁', className: 'cs2-main', Component: CaseStudiesGrid as never },
  ],
};

export default registry;
