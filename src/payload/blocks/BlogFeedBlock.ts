import type { Block } from 'payload';

export const BlogFeedBlock: Block = {
  slug: 'blog-feed-block',
  interfaceName: 'BlogFeedBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Latest posts', value: 'latest' },
        { label: 'By category', value: 'category' },
        { label: 'By tag', value: 'tag' },
        { label: 'Manual selection', value: 'manual' },
      ],
    },
    { name: 'category', type: 'text', admin: { description: 'Category slug (used when source = category)' } },
    { name: 'tag', type: 'text', admin: { description: 'Tag slug (used when source = tag)' } },
    { name: 'limit', type: 'number', defaultValue: 3 },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Featured (large + small)', value: 'featured' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
    },
    { name: 'showExcerpt', type: 'checkbox', defaultValue: true },
    { name: 'showDate', type: 'checkbox', defaultValue: true },
    { name: 'showCategory', type: 'checkbox', defaultValue: true },
    { name: 'ctaLabel', type: 'text', admin: { description: '"View all" button label' } },
    { name: 'ctaHref', type: 'text', admin: { description: '"View all" button URL' } },
  ],
};
