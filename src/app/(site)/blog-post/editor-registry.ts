import Hero from './components/Hero';
import Article from './components/Article';
import Related from './components/Related';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'blog-post',
  defaultContent,
  sections: [
    { key: 'hero',    label: 'Hero',         icon: '📝', className: 'bp2-hero',    Component: Hero as never },
    { key: 'article', label: 'Article',      icon: '📄', className: 'bp2-content', Component: Article as never },
    { key: 'related', label: 'Related Posts', icon: '🔗', className: 'bp2-related', Component: Related as never },
  ],
};

export default registry;
