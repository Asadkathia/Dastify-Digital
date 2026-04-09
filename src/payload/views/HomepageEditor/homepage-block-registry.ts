import type { BlockDefinition } from '../PageEditor/types';

/**
 * Block definitions for every homepage section.
 * The blockType prefix "hp-" namespaces them away from the generic block registry.
 */
export const homepageBlockRegistry: Record<string, BlockDefinition> = {
  'hp-nav': {
    blockType: 'hp-nav',
    label: 'Navigation',
    icon: '🧭',
    category: 'Homepage',
    defaultData: {
      logo: 'Dastify.Digital',
      cta: 'Book Free Audit →',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Results', href: '/case-studies' },
        { label: 'Insights', href: '/blog' },
        { label: 'About', href: '#about' },
      ],
    },
    fields: [
      { name: 'logo', type: 'text', label: 'Logo Text' },
      { name: 'cta', type: 'text', label: 'CTA Button Label' },
      {
        name: 'links',
        type: 'array',
        label: 'Nav Links',
        subFields: [
          { name: 'label', type: 'text', label: 'Label', required: true },
          { name: 'href', type: 'text', label: 'URL', required: true },
        ],
      },
    ],
  },

  'hp-hero': {
    blockType: 'hp-hero',
    label: 'Hero',
    icon: '🦸',
    category: 'Homepage',
    defaultData: {
      chip: 'AI-Powered Healthcare Marketing',
      primaryCta: 'Get Free Growth Audit →',
      secondaryCta: 'See Real Results',
      description: 'Generic agencies waste healthcare budgets.',
      image: '/images/hero-image.webp',
      imageAlt: 'Hero Image',
      badgeValue: '309%',
      badgeLabel: 'Patient inquiry lift — 90 days',
      headingLines: [
        { text: 'The Creative' },
        { text: 'Agency', delay: 1 },
        { text: 'Healthcare', delay: 2, colorVar: 'var(--blue)' },
        { text: 'Deserves.', delay: 3 },
      ],
      stats: [
        { value: '0', counterTarget: 1000, suffix: '+', label: 'Practices Served' },
        { value: '0', counterTarget: 95, suffix: '%', label: 'Client Retention' },
        { value: '$50M', suffix: '+', label: 'Revenue Generated' },
      ],
      marquee: ['Healthcare SEO', 'Google Ads & PPC', 'Website Design', 'Reputation Management'],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'primaryCta', type: 'text', label: 'Primary CTA Label' },
      { name: 'secondaryCta', type: 'text', label: 'Secondary CTA Label' },
      { name: 'image', type: 'upload', label: 'Hero Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      { name: 'badgeValue', type: 'text', label: 'Badge Value' },
      { name: 'badgeLabel', type: 'text', label: 'Badge Label' },
      {
        name: 'headingLines',
        type: 'array',
        label: 'Heading Lines',
        subFields: [
          { name: 'text', type: 'text', label: 'Line Text', required: true },
          { name: 'colorVar', type: 'text', label: 'Color (CSS var or hex)' },
        ],
      },
      {
        name: 'stats',
        type: 'array',
        label: 'Stats',
        subFields: [
          { name: 'value', type: 'text', label: 'Display Value (e.g. $50M)' },
          { name: 'counterTarget', type: 'text', label: 'Counter Target (number)' },
          { name: 'suffix', type: 'text', label: 'Suffix (e.g. +, %)' },
          { name: 'label', type: 'text', label: 'Stat Label', required: true },
        ],
      },
      {
        name: 'marquee',
        type: 'array',
        label: 'Marquee Items',
        subFields: [
          { name: 'value', type: 'text', label: 'Item Text', required: true },
        ],
      },
    ],
  },

  'hp-brand-acronym': {
    blockType: 'hp-brand-acronym',
    label: 'Brand Acronym',
    icon: '🔤',
    category: 'Homepage',
    defaultData: {
      chip: 'Our Name. Our Promise.',
      title: 'Every Letter Stands for Something.',
      subtitle: 'DASTIFY DIGITAL — decoded.',
      items: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      {
        name: 'items',
        type: 'array',
        label: 'Acronym Items',
        subFields: [
          { name: 'l', type: 'text', label: 'Letter', required: true },
          { name: 'word', type: 'text', label: 'Word (DASTIFY or DIGITAL)' },
          { name: 't1', type: 'text', label: 'Line 1 (e.g. Data-Driven)' },
          { name: 't2', type: 'text', label: 'Line 2 (e.g. Marketing)' },
          {
            name: 'color',
            type: 'select',
            label: 'Color',
            options: [
              { label: 'Purple', value: 'purple' },
              { label: 'Blue', value: 'blue' },
            ],
          },
          {
            name: 'dir',
            type: 'select',
            label: 'Direction',
            options: [
              { label: 'Up', value: 'up' },
              { label: 'Down', value: 'down' },
            ],
          },
        ],
      },
    ],
  },

  'hp-about': {
    blockType: 'hp-about',
    label: 'About',
    icon: '🏢',
    category: 'Homepage',
    defaultData: {
      chip: 'About Dastify Digital',
      cta: 'Learn More →',
      image: '/images/about-image-02.webp',
      imageAlt: 'About Image',
      headingLines: [{ text: 'Experience innovative marketing' }],
      paragraphs: ['We craft data-driven campaigns...'],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'cta', type: 'text', label: 'CTA Label' },
      { name: 'image', type: 'upload', label: 'About Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      {
        name: 'headingLines',
        type: 'array',
        label: 'Heading Lines',
        subFields: [
          { name: 'text', type: 'text', label: 'Line Text', required: true },
          { name: 'colorVar', type: 'text', label: 'Color (CSS var or hex)' },
        ],
      },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Paragraphs',
        subFields: [
          { name: 'value', type: 'textarea', label: 'Paragraph', required: true },
        ],
      },
    ],
  },

  'hp-features': {
    blockType: 'hp-features',
    label: 'Feature Strip',
    icon: '✨',
    category: 'Homepage',
    defaultData: {
      cards: [
        {
          category: 'Specialty Marketing',
          title: 'HIPAA-Safe Digital Campaigns',
          description: 'Campaigns built from the ground up.',
          image: '/images/feature-image-3.webp',
          alt: 'Feature Image 1',
        },
      ],
    },
    fields: [
      {
        name: 'cards',
        type: 'array',
        label: 'Feature Cards',
        subFields: [
          { name: 'category', type: 'text', label: 'Category Label' },
          { name: 'title', type: 'text', label: 'Card Title', required: true },
          { name: 'description', type: 'textarea', label: 'Card Description' },
          { name: 'image', type: 'upload', label: 'Card Image' },
          { name: 'alt', type: 'text', label: 'Image Alt Text' },
        ],
      },
    ],
  },

  'hp-case-studies': {
    blockType: 'hp-case-studies',
    label: 'Case Studies',
    icon: '📊',
    category: 'Homepage',
    defaultData: {
      chip: 'Our Latest Results',
      title: 'We deliver exceptional patient growth.',
      cta: 'View All Case Studies →',
      tabs: [
        { id: 'dental', label: 'Dental' },
        { id: 'derm', label: 'Dermatology' },
      ],
      main: {
        tag: 'Dental Practices · Dallas, TX',
        title: 'Multi-location Dental Group',
        description: 'Complete digital overhaul.',
        stat: '+309%',
        statLabel: 'Patient inquiry lift',
        image: '/images/case-study-image-4.webp',
        alt: 'Case Study Image',
      },
      minis: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'cta', type: 'text', label: 'CTA Label' },
      {
        name: 'tabs',
        type: 'array',
        label: 'Specialty Tabs',
        subFields: [
          { name: 'id', type: 'text', label: 'Tab ID', required: true },
          { name: 'label', type: 'text', label: 'Tab Label', required: true },
        ],
      },
      // Main featured case study — nested object flattened to array/text for ConfigPanel compatibility
      { name: 'main.tag', type: 'text', label: 'Featured: Tag Line' },
      { name: 'main.title', type: 'text', label: 'Featured: Title' },
      { name: 'main.description', type: 'textarea', label: 'Featured: Description' },
      { name: 'main.stat', type: 'text', label: 'Featured: Stat' },
      { name: 'main.statLabel', type: 'text', label: 'Featured: Stat Label' },
      { name: 'main.image', type: 'upload', label: 'Featured: Image' },
      { name: 'main.alt', type: 'text', label: 'Featured: Image Alt' },
      {
        name: 'minis',
        type: 'array',
        label: 'Mini Case Studies',
        subFields: [
          { name: 'tag', type: 'text', label: 'Tag' },
          { name: 'title', type: 'text', label: 'Title', required: true },
          { name: 'stat', type: 'text', label: 'Stat' },
          { name: 'statLabel', type: 'text', label: 'Stat Label' },
          { name: 'image', type: 'upload', label: 'Image' },
          { name: 'alt', type: 'text', label: 'Alt Text' },
        ],
      },
    ],
  },

  'hp-services': {
    blockType: 'hp-services',
    label: 'Services',
    icon: '🛠️',
    category: 'Homepage',
    defaultData: {
      chip: 'Services',
      titleLines: ['Seamless patient growth', 'solutions tailored for you.'],
      description: 'From solo clinics to multi-location groups.',
      items: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'description', type: 'textarea', label: 'Description' },
      {
        name: 'titleLines',
        type: 'array',
        label: 'Title Lines',
        subFields: [
          { name: 'value', type: 'text', label: 'Line', required: true },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Service Items',
        subFields: [
          { name: 'number', type: 'text', label: 'Number (e.g. 01)' },
          { name: 'name', type: 'text', label: 'Service Name', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'image', type: 'upload', label: 'Service Image' },
          { name: 'alt', type: 'text', label: 'Image Alt' },
        ],
      },
    ],
  },

  'hp-mission': {
    blockType: 'hp-mission',
    label: 'Mission',
    icon: '🎯',
    category: 'Homepage',
    defaultData: {
      chip: 'About Dastify Digital',
      title: 'With a commitment to excellence.',
      description: '',
      cta: 'Book a Strategy Call →',
      image: '/images/mission-image.webp',
      imageAlt: 'Mission Image',
      checks: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'cta', type: 'text', label: 'CTA Label' },
      { name: 'image', type: 'upload', label: 'Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      {
        name: 'checks',
        type: 'array',
        label: 'Checklist Items',
        subFields: [
          { name: 'value', type: 'text', label: 'Item', required: true },
        ],
      },
    ],
  },

  'hp-insights': {
    blockType: 'hp-insights',
    label: 'Insights',
    icon: '💡',
    category: 'Homepage',
    defaultData: {
      chip: 'Our featured insights',
      title: 'Healthcare marketing, decoded.',
      cta: 'View All Articles →',
      items: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'cta', type: 'text', label: 'CTA Label' },
      {
        name: 'items',
        type: 'array',
        label: 'Insight Articles',
        subFields: [
          { name: 'date', type: 'text', label: 'Date (e.g. March 2026)' },
          { name: 'title', type: 'text', label: 'Article Title', required: true },
          { name: 'image', type: 'upload', label: 'Thumbnail Image' },
          { name: 'alt', type: 'text', label: 'Image Alt' },
        ],
      },
    ],
  },

  'hp-faq': {
    blockType: 'hp-faq',
    label: 'FAQ',
    icon: '❓',
    category: 'Homepage',
    defaultData: {
      chip: 'Get started',
      title: 'Frequently asked questions.',
      intro: 'Everything you need to know.',
      cta: 'Book Free Strategy Call →',
      items: [],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'intro', type: 'textarea', label: 'Intro Text' },
      { name: 'cta', type: 'text', label: 'CTA Label' },
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

  'hp-cta': {
    blockType: 'hp-cta',
    label: 'CTA Section',
    icon: '📣',
    category: 'Homepage',
    defaultData: {
      chip: 'Get started',
      subtitle: 'We build HIPAA-compliant campaigns.',
      inputPlaceholder: 'Enter your work email',
      button: 'Get started →',
      note: 'No obligation · Free 30-minute strategy session',
      headingLines: [
        { text: 'Schedule a' },
        { text: 'free consultation.', delay: 1, color: '#EDE6FF' },
      ],
    },
    fields: [
      { name: 'chip', type: 'text', label: 'Eyebrow Chip' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      { name: 'inputPlaceholder', type: 'text', label: 'Input Placeholder' },
      { name: 'button', type: 'text', label: 'Button Label' },
      { name: 'note', type: 'text', label: 'Fine Print Note' },
      {
        name: 'headingLines',
        type: 'array',
        label: 'Heading Lines',
        subFields: [
          { name: 'text', type: 'text', label: 'Line Text', required: true },
          { name: 'color', type: 'text', label: 'Color (hex or CSS)' },
        ],
      },
    ],
  },

  'hp-footer': {
    blockType: 'hp-footer',
    label: 'Footer',
    icon: '📋',
    category: 'Homepage',
    defaultData: {
      logo: 'Dastify.Digital',
      tagline: 'The creative authority for healthcare growth.',
      copyright: '© 2026 Dastify Digital. All rights reserved.',
      socials: [],
      columns: [],
      badges: [],
    },
    fields: [
      { name: 'logo', type: 'text', label: 'Logo Text' },
      { name: 'tagline', type: 'textarea', label: 'Tagline' },
      { name: 'copyright', type: 'text', label: 'Copyright Text' },
      {
        name: 'socials',
        type: 'array',
        label: 'Social Links',
        subFields: [
          { name: 'label', type: 'text', label: 'Icon / Label', required: true },
          { name: 'href', type: 'text', label: 'URL', required: true },
        ],
      },
      {
        name: 'columns',
        type: 'array',
        label: 'Footer Columns',
        subFields: [
          { name: 'title', type: 'text', label: 'Column Title', required: true },
          { name: 'button', type: 'text', label: 'CTA Button (optional)' },
        ],
      },
      {
        name: 'badges',
        type: 'array',
        label: 'Trust Badges',
        subFields: [
          { name: 'label', type: 'text', label: 'Badge Label', required: true },
          {
            name: 'tone',
            type: 'select',
            label: 'Color Tone',
            options: [
              { label: 'Default', value: '' },
              { label: 'Blue', value: 'blue' },
              { label: 'Green', value: 'green' },
            ],
          },
        ],
      },
    ],
  },
};

export function getHomepageBlockDefinition(blockType: string) {
  return homepageBlockRegistry[blockType] ?? null;
}
