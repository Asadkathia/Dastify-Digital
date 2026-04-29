import Hero from './components/Hero';
import Scheduler from './components/Scheduler';
import Form from './components/Form';
import Sidebar from './components/Sidebar';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'book-session',
  defaultContent,
  sections: [
    { key: 'hero',      label: 'Hero',      icon: '🦸', className: 'bk2-hero',      Component: Hero as never },
    { key: 'scheduler', label: 'Scheduler', icon: '📅', className: 'bk2-scheduler', Component: Scheduler as never },
    { key: 'form',      label: 'Form',      icon: '📝', className: 'bk2-form-wrap', Component: Form as never },
    { key: 'sidebar',   label: 'Sidebar',   icon: '📋', className: 'bk2-sidebar',   Component: Sidebar as never },
  ],
};

export default registry;
