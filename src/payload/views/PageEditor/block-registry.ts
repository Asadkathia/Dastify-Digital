import type { BlockDefinition } from './types';
import { homepageBlockRegistry } from '../HomepageEditor/homepage-block-registry';

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

  'pricing-block': {
    blockType: 'pricing-block',
    label: 'Pricing',
    icon: '💳',
    category: 'Conversion',
    defaultData: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your practice.',
      plans: [
        {
          name: 'Starter',
          price: '$499',
          period: '/mo',
          description: 'Perfect for growing practices.',
          features: 'SEO Optimization\nGoogle My Business\nMonthly Report',
          ctaLabel: 'Get Started',
          ctaHref: '/contact',
          highlighted: false,
        },
        {
          name: 'Growth',
          price: '$999',
          period: '/mo',
          description: 'Full-service marketing for established clinics.',
          features: 'Everything in Starter\nPaid Ads Management\nContent Marketing\nBi-weekly Calls',
          ctaLabel: 'Get Started',
          ctaHref: '/contact',
          highlighted: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          period: '',
          description: 'Multi-location and enterprise healthcare groups.',
          features: 'Everything in Growth\nDedicated Account Manager\nCustom Integrations\nSLA Guarantee',
          ctaLabel: 'Contact Us',
          ctaHref: '/contact',
          highlighted: false,
        },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      {
        name: 'plans',
        type: 'array',
        label: 'Plans',
        subFields: [
          { name: 'name', type: 'text', label: 'Plan Name', required: true },
          { name: 'price', type: 'text', label: 'Price', required: true },
          { name: 'period', type: 'text', label: 'Period (e.g. /mo)' },
          { name: 'description', type: 'text', label: 'Description' },
          { name: 'features', type: 'textarea', label: 'Features (one per line)' },
          { name: 'ctaLabel', type: 'text', label: 'Button Label' },
          { name: 'ctaHref', type: 'text', label: 'Button URL' },
          { name: 'highlighted', type: 'checkbox', label: 'Most Popular' },
        ],
      },
    ],
  },

  'logo-carousel-block': {
    blockType: 'logo-carousel-block',
    label: 'Logo Carousel',
    icon: '🏢',
    category: 'Media',
    defaultData: {
      title: 'Trusted by leading healthcare organizations',
      logos: [],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Label Text' },
      {
        name: 'logos',
        type: 'array',
        label: 'Logos',
        subFields: [
          { name: 'image', type: 'upload', label: 'Logo Image' },
          { name: 'imageAlt', type: 'text', label: 'Alt Text' },
          { name: 'href', type: 'text', label: 'Link URL (optional)' },
        ],
      },
    ],
  },

  'video-embed-block': {
    blockType: 'video-embed-block',
    label: 'Video Embed',
    icon: '▶️',
    category: 'Media',
    defaultData: {
      url: '',
      title: '',
      caption: '',
      autoplay: false,
    },
    fields: [
      { name: 'url', type: 'text', label: 'YouTube or Vimeo URL', required: true },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'caption', type: 'text', label: 'Caption' },
      { name: 'autoplay', type: 'checkbox', label: 'Autoplay' },
    ],
  },

  'spacer-block': {
    blockType: 'spacer-block',
    label: 'Spacer',
    icon: '↕️',
    category: 'Layout',
    defaultData: {
      height: 60,
      showDivider: false,
    },
    fields: [
      { name: 'height', type: 'text', label: 'Height (px)' },
      { name: 'showDivider', type: 'checkbox', label: 'Show Divider Line' },
    ],
  },

  'accordion-block': {
    blockType: 'accordion-block',
    label: 'Accordion',
    icon: '📋',
    category: 'Content',
    defaultData: {
      title: 'Topics',
      items: [
        { heading: 'What is healthcare marketing?', body: 'Healthcare marketing is the process of promoting your medical practice to attract and retain patients.' },
        { heading: 'How long until I see results?', body: 'Most clients see measurable results within 60-90 days of campaign launch.' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'items',
        type: 'array',
        label: 'Items',
        subFields: [
          { name: 'heading', type: 'text', label: 'Heading', required: true },
          { name: 'body', type: 'textarea', label: 'Body Text', required: true },
        ],
      },
    ],
  },

  'button-block': {
    blockType: 'button-block',
    label: 'Button',
    icon: '🔘',
    category: 'Conversion',
    defaultData: {
      label: 'Get Started',
      href: '#',
      variant: 'solid',
      size: 'md',
      color: '#0ea5e9',
      align: 'center',
      openInNewTab: false,
    },
    fields: [
      { name: 'label', type: 'text', label: 'Button Label', required: true },
      { name: 'href', type: 'text', label: 'URL', required: true },
      {
        name: 'variant',
        type: 'select',
        label: 'Style',
        options: [
          { label: 'Solid (filled)', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost (text only)', value: 'ghost' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      { name: 'color', type: 'text', label: 'Color (hex or CSS)' },
      {
        name: 'align',
        type: 'select',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      { name: 'openInNewTab', type: 'checkbox', label: 'Open in New Tab' },
    ],
  },

  'heading-block': {
    blockType: 'heading-block',
    label: 'Heading',
    icon: 'H',
    category: 'Content',
    defaultData: {
      text: 'Your Heading Here',
      tag: 'h2',
      align: 'left',
      color: '',
      size: 'lg',
    },
    fields: [
      { name: 'text', type: 'text', label: 'Heading Text', required: true },
      {
        name: 'tag',
        type: 'select',
        label: 'HTML Tag',
        options: [
          { label: 'H1 (Page Title)', value: 'h1' },
          { label: 'H2 (Section)', value: 'h2' },
          { label: 'H3 (Sub-section)', value: 'h3' },
          { label: 'H4', value: 'h4' },
          { label: 'H5', value: 'h5' },
          { label: 'H6', value: 'h6' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'XS (16px)', value: 'xs' },
          { label: 'SM (20px)', value: 'sm' },
          { label: 'MD (28px)', value: 'md' },
          { label: 'LG (36px)', value: 'lg' },
          { label: 'XL (48px)', value: 'xl' },
          { label: '2XL (64px)', value: '2xl' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      { name: 'color', type: 'text', label: 'Color (hex or CSS)' },
    ],
  },

  'image-block': {
    blockType: 'image-block',
    label: 'Image',
    icon: '🖼',
    category: 'Media',
    defaultData: {
      image: null,
      imageAlt: '',
      href: '',
      openInNewTab: false,
      borderRadius: 0,
      objectPosition: 'center',
      maxWidth: null,
      align: 'center',
      caption: '',
    },
    fields: [
      { name: 'image', type: 'upload', label: 'Image' },
      { name: 'imageAlt', type: 'text', label: 'Alt Text' },
      { name: 'caption', type: 'text', label: 'Caption' },
      { name: 'href', type: 'text', label: 'Link URL (optional)' },
      { name: 'openInNewTab', type: 'checkbox', label: 'Open link in New Tab' },
      { name: 'borderRadius', type: 'text', label: 'Border Radius (px)' },
      {
        name: 'objectPosition',
        type: 'select',
        label: 'Focal Point',
        options: [
          { label: 'Center', value: 'center' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Top Left', value: 'top left' },
          { label: 'Top Right', value: 'top right' },
          { label: 'Bottom Left', value: 'bottom left' },
          { label: 'Bottom Right', value: 'bottom right' },
        ],
      },
      { name: 'maxWidth', type: 'text', label: 'Max Width (px, optional)' },
      {
        name: 'align',
        type: 'select',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
  },

  'alert-block': {
    blockType: 'alert-block',
    label: 'Alert / Callout',
    icon: '📢',
    category: 'Content',
    defaultData: {
      variant: 'info',
      title: '',
      body: 'Important information for your visitors.',
      dismissible: false,
    },
    fields: [
      {
        name: 'variant',
        type: 'select',
        label: 'Type',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
        ],
      },
      { name: 'title', type: 'text', label: 'Title (optional)' },
      { name: 'body', type: 'textarea', label: 'Message', required: true },
      { name: 'dismissible', type: 'checkbox', label: 'Dismissible' },
    ],
  },

  'tabs-block': {
    blockType: 'tabs-block',
    label: 'Tabs',
    icon: '📑',
    category: 'Content',
    defaultData: {
      tabs: [
        { label: 'Overview', content: 'Content for the Overview tab.' },
        { label: 'Details', content: 'Content for the Details tab.' },
        { label: 'FAQ', content: 'Content for the FAQ tab.' },
      ],
    },
    fields: [
      {
        name: 'tabs',
        type: 'array',
        label: 'Tabs',
        subFields: [
          { name: 'label', type: 'text', label: 'Tab Label', required: true },
          { name: 'content', type: 'textarea', label: 'Tab Content', required: true },
        ],
      },
    ],
  },

  'social-icons-block': {
    blockType: 'social-icons-block',
    label: 'Social Icons',
    icon: '🔗',
    category: 'Content',
    defaultData: {
      title: 'Follow Us',
      align: 'center',
      size: 'md',
      links: [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Label (optional)' },
      {
        name: 'align',
        type: 'select',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Icon Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'links',
        type: 'array',
        label: 'Social Links',
        subFields: [
          { name: 'platform', type: 'text', label: 'Platform (e.g. facebook, instagram)', required: true },
          { name: 'url', type: 'text', label: 'URL', required: true },
        ],
      },
    ],
  },

  'custom-html-block': {
    blockType: 'custom-html-block',
    label: 'Custom HTML',
    icon: '</> ',
    category: 'Content',
    defaultData: {
      label: 'Custom Embed',
      html: '<div style="padding:20px;background:#f5f5f5;border-radius:8px;font-family:monospace;color:#333;">Your custom HTML here</div>',
    },
    fields: [
      { name: 'label', type: 'text', label: 'Internal Label' },
      { name: 'html', type: 'textarea', label: 'HTML / Embed Code', required: true },
    ],
  },

  'counter-block': {
    blockType: 'counter-block',
    label: 'Counter',
    icon: '🔢',
    category: 'Content',
    defaultData: {
      title: 'Our Numbers',
      duration: 2000,
      items: [
        { value: 500, suffix: '+', label: 'Clients Served' },
        { value: 95, suffix: '%', label: 'Satisfaction Rate' },
        { value: 10, suffix: 'x', label: 'Average ROI' },
        { value: 8, prefix: '', suffix: ' yrs', label: 'In Business' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'duration', type: 'text', label: 'Animation Duration (ms)' },
      {
        name: 'items',
        type: 'array',
        label: 'Counters',
        subFields: [
          { name: 'value', type: 'text', label: 'Number', required: true },
          { name: 'prefix', type: 'text', label: 'Prefix (e.g. $)' },
          { name: 'suffix', type: 'text', label: 'Suffix (e.g. +, %)' },
          { name: 'label', type: 'text', label: 'Label', required: true },
        ],
      },
    ],
  },

  'progress-bar-block': {
    blockType: 'progress-bar-block',
    label: 'Progress Bars',
    icon: '📊',
    category: 'Content',
    defaultData: {
      title: 'Our Expertise',
      items: [
        { label: 'SEO & Content', value: 95, color: '#0ea5e9' },
        { label: 'Paid Advertising', value: 88, color: '#6366f1' },
        { label: 'Social Media', value: 82, color: '#10b981' },
        { label: 'Email Marketing', value: 75, color: '#f59e0b' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'items',
        type: 'array',
        label: 'Bars',
        subFields: [
          { name: 'label', type: 'text', label: 'Label', required: true },
          { name: 'value', type: 'text', label: 'Percentage (0–100)', required: true },
          { name: 'color', type: 'text', label: 'Color (hex)' },
        ],
      },
    ],
  },

  'image-gallery-block': {
    blockType: 'image-gallery-block',
    label: 'Image Gallery',
    icon: '🖼️',
    category: 'Media',
    defaultData: {
      title: 'Gallery',
      columns: 3,
      lightbox: true,
      images: [],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ],
      },
      { name: 'lightbox', type: 'checkbox', label: 'Enable Lightbox' },
      {
        name: 'images',
        type: 'array',
        label: 'Images',
        subFields: [
          { name: 'image', type: 'upload', label: 'Image' },
          { name: 'imageAlt', type: 'text', label: 'Alt Text' },
          { name: 'caption', type: 'text', label: 'Caption' },
        ],
      },
    ],
  },

  'card-grid-block': {
    blockType: 'card-grid-block',
    label: 'Card Grid',
    icon: '🃏',
    category: 'Content',
    defaultData: {
      title: 'Our Services',
      subtitle: 'Everything your practice needs to grow.',
      columns: 3,
      cards: [
        { title: 'SEO & Local Search', eyebrow: 'Visibility', text: 'Rank higher on Google and attract patients searching for your services.', ctaLabel: 'Learn More', ctaHref: '/services' },
        { title: 'Paid Advertising', eyebrow: 'Growth', text: 'Targeted Google and Meta ads campaigns that convert clicks into appointments.', ctaLabel: 'Learn More', ctaHref: '/services' },
        { title: 'Reputation Management', eyebrow: 'Trust', text: 'Build and maintain a 5-star reputation across all major review platforms.', ctaLabel: 'Learn More', ctaHref: '/services' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ],
      },
      {
        name: 'cards',
        type: 'array',
        label: 'Cards',
        subFields: [
          { name: 'image', type: 'upload', label: 'Card Image' },
          { name: 'imageAlt', type: 'text', label: 'Image Alt' },
          { name: 'eyebrow', type: 'text', label: 'Eyebrow Label' },
          { name: 'title', type: 'text', label: 'Card Title', required: true },
          { name: 'text', type: 'textarea', label: 'Card Text' },
          { name: 'ctaLabel', type: 'text', label: 'Link Label' },
          { name: 'ctaHref', type: 'text', label: 'Link URL' },
        ],
      },
    ],
  },
};

// ─── Merge homepage blocks ────────────────────────────────────────────────────
// Static import above — no require() needed. Both registries are in the same
// build so this is a clean, ESM-safe merge.

export const blockCategories: Array<{ name: string; blocks: BlockDefinition[] }> = [
  {
    name: 'Homepage',
    blocks: Object.values(homepageBlockRegistry),
  },
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
  {
    name: 'Media',
    blocks: Object.values(blockRegistry).filter((b) => b.category === 'Media'),
  },
].filter((cat) => cat.blocks.length > 0);

const runtimeBlockRegistry: Record<string, BlockDefinition> = {};

export function registerRuntimeBlockDefinitions(definitions: Record<string, BlockDefinition>) {
  for (const [key, value] of Object.entries(definitions)) {
    runtimeBlockRegistry[key] = value;
  }
}

export function clearRuntimeBlockDefinitions(prefix?: string) {
  if (!prefix) {
    for (const key of Object.keys(runtimeBlockRegistry)) delete runtimeBlockRegistry[key];
    return;
  }
  for (const key of Object.keys(runtimeBlockRegistry)) {
    if (key.startsWith(prefix)) delete runtimeBlockRegistry[key];
  }
}

export function getBlockDefinition(blockType: string): BlockDefinition | undefined {
  // Check standard registry first, then homepage registry
  return blockRegistry[blockType] ?? homepageBlockRegistry[blockType] ?? runtimeBlockRegistry[blockType];
}

export function createBlockInstance(blockType: string): import('./types').BlockInstance | null {
  const def = getBlockDefinition(blockType);
  if (!def) return null;
  return {
    id: `${blockType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    blockType,
    data: structuredClone(def.defaultData),
  };
}
