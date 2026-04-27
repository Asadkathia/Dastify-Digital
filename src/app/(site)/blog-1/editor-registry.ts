import Hero from './components/Hero';
import Main from './components/Main';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'blog-1',
  defaultContent,
  sections: [
    { key: 'hero', label: 'Hero',            icon: '📰', className: 'bl2-hero', Component: Hero as never },
    { key: 'main', label: 'Featured + Grid', icon: '🗂️', className: 'bl2-main', Component: Main as never },
  ],
};

export default registry;
