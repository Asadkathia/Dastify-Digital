import type { CollectionConfig, PayloadRequest } from 'payload';
import { isAdmin } from '../access.ts';

const adminOnly = ({ req }: { req: PayloadRequest }) => isAdmin(req);

export const ImportReports: CollectionConfig = {
  slug: 'import-reports',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'provider', 'model', 'fallbackSections', 'importedAt'],
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'title', type: 'text' },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Anthropic', value: 'anthropic' },
        { label: 'OpenAI', value: 'openai' },
        { label: 'Google', value: 'google' },
        { label: 'OpenRouter', value: 'openrouter' },
        { label: 'Ollama', value: 'ollama' },
      ],
    },
    { name: 'model', type: 'text', required: true },
    { name: 'totalSections', type: 'number' },
    { name: 'mappedSections', type: 'number' },
    { name: 'fallbackSections', type: 'number' },
    { name: 'warnings', type: 'json' },
    { name: 'externalImages', type: 'json' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
        { name: 'canonicalURL', type: 'text' },
        { name: 'noindex', type: 'checkbox' },
      ],
    },
    { name: 'createdPageId', type: 'text' },
    { name: 'importedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
};
