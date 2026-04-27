import Hero from './components/Hero';
import Main from './components/Main';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'contact',
  defaultContent,
  sections: [
    { key: 'hero', label: 'Hero',         icon: '🦸', className: 'ct2-hero', Component: Hero as never },
    { key: 'main', label: 'Form & Info',  icon: '✉️', className: 'ct2-main', Component: Main as never },
  ],
};

export default registry;
