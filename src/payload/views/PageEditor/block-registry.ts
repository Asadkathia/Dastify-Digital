import type { BlockDefinition } from './types';

export const blockRegistry: Record<string, BlockDefinition> = {
  'hero-block': {
    blockType: 'hero-block',
    label: 'Hero',
    icon: '🖼️',
    category: 'Layout',
    defaultData: {
      eyebrow: 'Healthcare Marketing',
      title: 'Your Hero Headline',
      subtitle: 'A compelling subtitle that explains your value proposition.',
      primaryCtaLabel: 'Get Started',
      primaryCtaHref: '#',
      secondaryCtaLabel: 'Learn More',
      secondaryCtaHref: '#',
      image: null,
      imageAlt: '',
    },
    fields: [
      { name: 'eyebrow', type: 'text', label: 'Eyebrow Label' },
      { name: 'title', type: 'text', label: 'Headline', required: true },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      { name: 'image', type: 'upload', label: 'Hero Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      { name: 'primaryCtaLabel', type: 'text', label: 'Primary Button Label' },
      { name: 'primaryCtaHref', type: 'text', label: 'Primary Button URL' },
      { name: 'secondaryCtaLabel', type: 'text', label: 'Secondary Button Label' },
      { name: 'secondaryCtaHref', type: 'text', label: 'Secondary Button URL' },
    ],
  },

  'rich-text-block': {
    blockType: 'rich-text-block',
    label: 'Rich Text',
    icon: '📝',
    category: 'Content',
    defaultData: {
      content: 'Write your content here. This block supports multi-paragraph text.',
    },
    fields: [
      { name: 'content', type: 'textarea', label: 'Content', required: true },
    ],
  },

  'text-image-block': {
    blockType: 'text-image-block',
    label: 'Text + Image',
    icon: '📐',
    category: 'Layout',
    defaultData: {
      title: 'Section Title',
      text: 'Describe what makes your service unique and valuable to your clients.',
      image: null,
      layout: 'right',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'text', type: 'textarea', label: 'Body Text' },
      { name: 'image', type: 'upload', label: 'Image' },
      {
        name: 'layout',
        type: 'select',
        label: 'Image Position',
        options: [
          { label: 'Image on Right', value: 'right' },
          { label: 'Image on Left', value: 'left' },
        ],
      },
    ],
  },

  'cta-block': {
    blockType: 'cta-block',
    label: 'Call to Action',
    icon: '🔔',
    category: 'Conversion',
    defaultData: {
      title: 'Ready to grow your practice?',
      subtitle: 'Let us help you reach more patients.',
      buttonLabel: 'Contact Us',
      buttonHref: '/contact',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Headline', required: true },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      { name: 'buttonLabel', type: 'text', label: 'Button Label', required: true },
      { name: 'buttonHref', type: 'text', label: 'Button URL', required: true },
    ],
  },

  'faq-block': {
    blockType: 'faq-block',
    label: 'FAQ',
    icon: '❓',
    category: 'Content',
    defaultData: {
      title: 'Frequently Asked Questions',
      items: [
        { question: 'What services do you offer?', answer: 'We offer a full range of healthcare marketing services.' },
        { question: 'How do I get started?', answer: 'Contact us for a free consultation.' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'items',
        type: 'array',
        label: 'FAQ Items',
        subFields: [
          { name: 'question', type: 'text', label: 'Question', required: true },
          { name: 'answer', type: 'textarea', label: 'Answer', required: true },
        ],
      },
    ],
  },

  'stats-block': {
    blockType: 'stats-block',
    label: 'Stats',
    icon: '📊',
    category: 'Content',
    defaultData: {
      title: 'Our Impact',
      items: [
        { value: '500+', label: 'Clients Served' },
        { value: '95%', label: 'Satisfaction Rate' },
        { value: '10x', label: 'Average ROI' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'items',
        type: 'array',
        label: 'Stats',
        subFields: [
          { name: 'value', type: 'text', label: 'Value', required: true },
          { name: 'label', type: 'text', label: 'Label', required: true },
        ],
      },
    ],
  },

  'two-col-block': {
    blockType: 'two-col-block',
    label: '2 Columns',
    icon: '⬛⬛',
    category: 'Layout',
    defaultData: {
      leftTitle: 'Left Column',
      leftText: 'Content for the left column goes here.',
      rightTitle: 'Right Column',
      rightText: 'Content for the right column goes here.',
      gap: 'medium',
    },
    fields: [
      { name: 'leftTitle', type: 'text', label: 'Left: Title' },
      { name: 'leftText', type: 'textarea', label: 'Left: Body Text' },
      { name: 'rightTitle', type: 'text', label: 'Right: Title' },
      { name: 'rightText', type: 'textarea', label: 'Right: Body Text' },
      {
        name: 'gap',
        type: 'select',
        label: 'Column Gap',
        options: [
          { label: 'Small (16px)', value: 'small' },
          { label: 'Medium (32px)', value: 'medium' },
          { label: 'Large (64px)', value: 'large' },
        ],
      },
    ],
  },

  'three-col-block': {
    blockType: 'three-col-block',
    label: '3 Columns',
    icon: '⬛⬛⬛',
    category: 'Layout',
    defaultData: {
      col1Title: 'Column One',
      col1Text: 'First column content.',
      col2Title: 'Column Two',
      col2Text: 'Second column content.',
      col3Title: 'Column Three',
      col3Text: 'Third column content.',
      gap: 'medium',
    },
    fields: [
      { name: 'col1Title', type: 'text', label: 'Col 1: Title' },
      { name: 'col1Text', type: 'textarea', label: 'Col 1: Body Text' },
      { name: 'col2Title', type: 'text', label: 'Col 2: Title' },
      { name: 'col2Text', type: 'textarea', label: 'Col 2: Body Text' },
      { name: 'col3Title', type: 'text', label: 'Col 3: Title' },
      { name: 'col3Text', type: 'textarea', label: 'Col 3: Body Text' },
      {
        name: 'gap',
        type: 'select',
        label: 'Column Gap',
        options: [
          { label: 'Small (16px)', value: 'small' },
          { label: 'Medium (32px)', value: 'medium' },
          { label: 'Large (64px)', value: 'large' },
        ],
      },
    ],
  },

  'testimonials-block': {
    blockType: 'testimonials-block',
    label: 'Testimonials',
    icon: '💬',
    category: 'Conversion',
    defaultData: {
      title: 'What Our Clients Say',
      items: [
        { quote: 'Working with Dastify transformed our patient acquisition strategy.', name: 'Dr. Sarah Johnson', role: 'Medical Director' },
        { quote: 'The results exceeded all of our expectations.', name: 'Dr. Mike Chen', role: 'Practice Owner' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'items',
        type: 'array',
        label: 'Testimonials',
        subFields: [
          { name: 'quote', type: 'textarea', label: 'Quote', required: true },
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'role', type: 'text', label: 'Role / Title' },
        ],
      },
    ],
  },
};

export const blockCategories: Array<{ name: string; blocks: BlockDefinition[] }> = [
  {
    name: 'Layout',
    blocks: Object.values(blockRegistry).filter((b) => b.category === 'Layout'),
  },
  {
    name: 'Content',
    blocks: Object.values(blockRegistry).filter((b) => b.category === 'Content'),
  },
  {
    name: 'Conversion',
    blocks: Object.values(blockRegistry).filter((b) => b.category === 'Conversion'),
  },
];

export function getBlockDefinition(blockType: string): BlockDefinition | undefined {
  return blockRegistry[blockType];
}

export function createBlockInstance(blockType: string): import('./types').BlockInstance | null {
  const def = blockRegistry[blockType];
  if (!def) return null;
  return {
    id: `${blockType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    blockType,
    data: structuredClone(def.defaultData),
  };
}
