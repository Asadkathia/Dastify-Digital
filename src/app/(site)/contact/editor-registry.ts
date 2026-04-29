import Hero from './components/Hero';
import Form from './components/Form';
import Info from './components/Info';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';

const registry: ConvertedPageRegistry = {
  pageName: 'contact',
  defaultContent,
  sections: [
    { key: 'hero', label: 'Hero', icon: '🦸', className: 'ct2-hero', Component: Hero as never },
    { key: 'form', label: 'Form', icon: '✉️', className: 'ct2-form-block', Component: Form as never },
    { key: 'info', label: 'Info', icon: 'ℹ️', className: 'ct2-info-block', Component: Info as never },
  ],
};

export default registry;
