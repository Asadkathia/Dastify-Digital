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
      primaryCtaLink: { url: '#', type: 'internal', openInNewTab: false },
      primaryCtaVariant: 'solid',
      primaryCtaSize: 'lg',
      secondaryCtaLabel: 'Learn More',
      secondaryCtaLink: { url: '#', type: 'internal', openInNewTab: false },
      secondaryCtaVariant: 'outline',
      secondaryCtaSize: 'lg',
      image: null,
      imageAlt: '',
    },
    fields: [
      { name: 'eyebrow', type: 'text', label: 'Eyebrow Label' },
      { name: 'title', type: 'text', label: 'Headline', required: true },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      { name: 'image', type: 'upload', label: 'Hero Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      // Primary CTA
      { name: 'primaryCtaLabel', type: 'text', label: 'Primary Button Label' },
      { name: 'primaryCtaLink', type: 'link', label: 'Primary Button Link' },
      {
        name: 'primaryCtaVariant',
        type: 'select',
        label: 'Primary Button Style',
        options: [
          { label: 'Solid (filled)', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost (text only)', value: 'ghost' },
        ],
      },
      {
        name: 'primaryCtaSize',
        type: 'select',
        label: 'Primary Button Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      // Secondary CTA
      { name: 'secondaryCtaLabel', type: 'text', label: 'Secondary Button Label' },
      { name: 'secondaryCtaLink', type: 'link', label: 'Secondary Button Link' },
      {
        name: 'secondaryCtaVariant',
        type: 'select',
        label: 'Secondary Button Style',
        options: [
          { label: 'Solid (filled)', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost (text only)', value: 'ghost' },
        ],
      },
      {
        name: 'secondaryCtaSize',
        type: 'select',
        label: 'Secondary Button Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
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
      buttonLink: { url: '/contact', type: 'internal', openInNewTab: false },
      buttonVariant: 'solid',
      buttonSize: 'lg',
      buttonColor: '',
      secondaryButtonLabel: '',
      secondaryButtonLink: { url: '', type: 'internal', openInNewTab: false },
      secondaryButtonVariant: 'outline',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Headline', required: true },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      { name: 'buttonLabel', type: 'text', label: 'Primary Button Label', required: true },
      { name: 'buttonLink', type: 'link', label: 'Primary Button Link' },
      {
        name: 'buttonVariant',
        type: 'select',
        label: 'Primary Button Style',
        options: [
          { label: 'Solid (filled)', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost (text only)', value: 'ghost' },
        ],
      },
      {
        name: 'buttonSize',
        type: 'select',
        label: 'Primary Button Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      { name: 'buttonColor', type: 'text', label: 'Primary Button Color (hex, optional)' },
      // Optional secondary button
      { name: 'secondaryButtonLabel', type: 'text', label: 'Secondary Button Label (optional)' },
      { name: 'secondaryButtonLink', type: 'link', label: 'Secondary Button Link' },
      {
        name: 'secondaryButtonVariant',
        type: 'select',
        label: 'Secondary Button Style',
        options: [
          { label: 'Solid (filled)', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost (text only)', value: 'ghost' },
        ],
      },
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
      link: { url: '#', type: 'internal', openInNewTab: false },
      variant: 'solid',
      size: 'md',
      color: '#0ea5e9',
      align: 'center',
      iconLeft: '',
      iconRight: '',
    },
    fields: [
      { name: 'label', type: 'text', label: 'Button Label', required: true },
      { name: 'link', type: 'link', label: 'Button Link' },
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
      { name: 'color', type: 'text', label: 'Button Color (hex or CSS)' },
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
      { name: 'iconLeft', type: 'text', label: 'Icon Left (emoji or SVG tag)' },
      { name: 'iconRight', type: 'text', label: 'Icon Right (emoji or SVG tag)' },
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

  'form-block': {
    blockType: 'form-block',
    label: 'Form',
    icon: '📋',
    category: 'Conversion',
    defaultData: {
      form: null,
      title: '',
      description: '',
      layout: 'centered',
      backgroundStyle: 'none',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title (optional)' },
      { name: 'description', type: 'textarea', label: 'Description (optional)' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Centered', value: 'centered' },
          { label: 'Left aligned', value: 'left' },
          { label: 'Card (boxed)', value: 'card' },
        ],
      },
      {
        name: 'backgroundStyle',
        type: 'select',
        label: 'Background',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
          { label: 'Brand', value: 'brand' },
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
          { name: 'ctaLabel', type: 'text', label: 'Button Label' },
          { name: 'ctaLink', type: 'link', label: 'Button Link' },
          {
            name: 'ctaVariant',
            type: 'select',
            label: 'Button Style',
            options: [
              { label: 'Solid', value: 'solid' },
              { label: 'Outline', value: 'outline' },
              { label: 'Ghost', value: 'ghost' },
            ],
          },
        ],
      },
    ],
  },

  // ─── New blocks ────────────────────────────────────────────────────────────

  'quote-block': {
    blockType: 'quote-block',
    label: 'Quote / Pullquote',
    icon: '💬',
    category: 'Content',
    defaultData: {
      quote: 'This is an inspiring quote that highlights your value.',
      author: 'Jane Smith',
      role: 'CEO, Acme Corp',
      avatar: null,
      size: 'md',
      align: 'center',
      accentColor: '#0ea5e9',
    },
    fields: [
      { name: 'quote', type: 'textarea', label: 'Quote Text', required: true },
      { name: 'author', type: 'text', label: 'Author Name' },
      { name: 'role', type: 'text', label: 'Author Role / Company' },
      { name: 'avatar', type: 'upload', label: 'Author Photo' },
      {
        name: 'size',
        type: 'select',
        label: 'Text Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
        ],
      },
      { name: 'accentColor', type: 'text', label: 'Accent Color (hex)' },
    ],
  },

  'divider-block': {
    blockType: 'divider-block',
    label: 'Divider',
    icon: '—',
    category: 'Content',
    defaultData: {
      style: 'line',
      color: '#e2e8f0',
      thickness: 1,
      spacing: 32,
      width: 'full',
    },
    fields: [
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        options: [
          { label: 'Line', value: 'line' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'Invisible (spacer)', value: 'none' },
        ],
      },
      { name: 'color', type: 'text', label: 'Color (hex)' },
      { name: 'thickness', type: 'text', label: 'Thickness (px)' },
      { name: 'spacing', type: 'text', label: 'Vertical Spacing (px)' },
      {
        name: 'width',
        type: 'select',
        label: 'Width',
        options: [
          { label: 'Full', value: 'full' },
          { label: '75%', value: '75' },
          { label: '50%', value: '50' },
          { label: '25%', value: '25' },
        ],
      },
    ],
  },

  'icon-block': {
    blockType: 'icon-block',
    label: 'Icon',
    icon: '★',
    category: 'Content',
    defaultData: {
      icon: '✨',
      size: 'md',
      color: '#0ea5e9',
      label: '',
      align: 'center',
    },
    fields: [
      { name: 'icon', type: 'text', label: 'Icon (emoji, character, or SVG)', required: true },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small (24px)', value: 'sm' },
          { label: 'Medium (48px)', value: 'md' },
          { label: 'Large (72px)', value: 'lg' },
          { label: 'XL (96px)', value: 'xl' },
        ],
      },
      { name: 'color', type: 'text', label: 'Color (hex)' },
      { name: 'label', type: 'text', label: 'Label (optional)' },
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

  'feature-list-block': {
    blockType: 'feature-list-block',
    label: 'Feature List',
    icon: '✅',
    category: 'Content',
    defaultData: {
      title: 'Why Choose Us',
      subtitle: 'Everything your practice needs to grow online.',
      layout: 'grid',
      columns: '3',
      items: [
        { icon: '🎯', title: 'Targeted Campaigns', description: 'Reach patients actively searching for your services.', iconColor: '#0ea5e9' },
        { icon: '📊', title: 'Data-Driven Results', description: 'Every decision backed by analytics and reporting.', iconColor: '#6366f1' },
        { icon: '🏆', title: 'Proven Track Record', description: '500+ healthcare practices grown nationwide.', iconColor: '#10b981' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
          { label: '2 Columns', value: '2col' },
        ],
      },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns (grid only)',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Features',
        subFields: [
          { name: 'icon', type: 'text', label: 'Icon (emoji)' },
          { name: 'title', type: 'text', label: 'Feature Title', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'iconColor', type: 'text', label: 'Icon Color (hex)' },
        ],
      },
    ],
  },

  'team-grid-block': {
    blockType: 'team-grid-block',
    label: 'Team Grid',
    icon: '👥',
    category: 'Content',
    defaultData: {
      title: 'Meet Our Team',
      subtitle: 'The experts behind your growth.',
      columns: '3',
      cardStyle: 'default',
      members: [
        { name: 'Alex Johnson', role: 'CEO & Founder', bio: 'Healthcare marketing expert with 15+ years of experience.', photo: null, linkedinUrl: '', email: '' },
        { name: 'Sarah Williams', role: 'Head of SEO', bio: 'Specializes in local search for medical practices.', photo: null, linkedinUrl: '', email: '' },
        { name: 'Mark Davis', role: 'Paid Ads Specialist', bio: 'Google Ads certified, focused on patient acquisition.', photo: null, linkedinUrl: '', email: '' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
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
        name: 'cardStyle',
        type: 'select',
        label: 'Card Style',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Card (bordered)', value: 'card' },
        ],
      },
      {
        name: 'members',
        type: 'array',
        label: 'Team Members',
        subFields: [
          { name: 'photo', type: 'upload', label: 'Photo' },
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'role', type: 'text', label: 'Role / Title' },
          { name: 'bio', type: 'textarea', label: 'Bio' },
          { name: 'linkedinUrl', type: 'text', label: 'LinkedIn URL' },
          { name: 'email', type: 'text', label: 'Email' },
        ],
      },
    ],
  },

  'blog-feed-block': {
    blockType: 'blog-feed-block',
    label: 'Blog Feed',
    icon: '📰',
    category: 'Content',
    defaultData: {
      title: 'Latest Insights',
      subtitle: 'Healthcare marketing tips and strategies.',
      source: 'latest',
      limit: 3,
      layout: 'grid',
      columns: '3',
      showExcerpt: true,
      showDate: true,
      showCategory: true,
      ctaLabel: 'View All Posts',
      ctaHref: '/blog',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      {
        name: 'source',
        type: 'select',
        label: 'Post Source',
        options: [
          { label: 'Latest posts', value: 'latest' },
          { label: 'By category', value: 'category' },
          { label: 'By tag', value: 'tag' },
        ],
      },
      { name: 'category', type: 'text', label: 'Category Slug (if source = category)' },
      { name: 'tag', type: 'text', label: 'Tag Slug (if source = tag)' },
      { name: 'limit', type: 'text', label: 'Number of Posts' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
          { label: 'Featured', value: 'featured' },
        ],
      },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ],
      },
      { name: 'showExcerpt', type: 'checkbox', label: 'Show Excerpt' },
      { name: 'showDate', type: 'checkbox', label: 'Show Date' },
      { name: 'showCategory', type: 'checkbox', label: 'Show Category' },
      { name: 'ctaLabel', type: 'text', label: '"View All" Button Label' },
      { name: 'ctaHref', type: 'text', label: '"View All" Button URL' },
    ],
  },

  'map-block': {
    blockType: 'map-block',
    label: 'Map',
    icon: '📍',
    category: 'Content',
    defaultData: {
      title: 'Find Us',
      address: '123 Main St, City, State 00000',
      embedUrl: '',
      height: 400,
      borderRadius: 12,
      showAddressCard: true,
      phone: '',
      hours: 'Mon–Fri: 9am–5pm',
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'address', type: 'text', label: 'Address' },
      { name: 'embedUrl', type: 'text', label: 'Google Maps Embed URL' },
      { name: 'height', type: 'text', label: 'Map Height (px)' },
      { name: 'borderRadius', type: 'text', label: 'Border Radius (px)' },
      { name: 'showAddressCard', type: 'checkbox', label: 'Show Address Info Card' },
      { name: 'phone', type: 'text', label: 'Phone Number' },
      { name: 'hours', type: 'text', label: 'Business Hours' },
    ],
  },

  'countdown-block': {
    blockType: 'countdown-block',
    label: 'Countdown Timer',
    icon: '⏱️',
    category: 'Conversion',
    defaultData: {
      title: 'Offer Ends In',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      expiredMessage: 'This offer has ended.',
      layout: 'boxes',
      align: 'center',
      accentColor: '#0ea5e9',
      showLabels: true,
    },
    fields: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'targetDate', type: 'text', label: 'Target Date (ISO 8601, e.g. 2025-12-31T23:59:59)' },
      { name: 'expiredMessage', type: 'text', label: 'Expired Message' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Boxes', value: 'boxes' },
          { label: 'Inline', value: 'inline' },
          { label: 'Minimal', value: 'minimal' },
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
      { name: 'accentColor', type: 'text', label: 'Accent Color (hex)' },
      { name: 'showLabels', type: 'checkbox', label: 'Show Unit Labels (Days, Hours…)' },
    ],
  },

  'table-block': {
    blockType: 'table-block',
    label: 'Table',
    icon: '📋',
    category: 'Content',
    defaultData: {
      title: '',
      caption: '',
      headers: [{ label: 'Feature' }, { label: 'Basic' }, { label: 'Pro' }],
      rows: [
        { cells: [{ value: 'SEO Audit' }, { value: '✓' }, { value: '✓' }] },
        { cells: [{ value: 'Monthly Reports' }, { value: '—' }, { value: '✓' }] },
        { cells: [{ value: 'Dedicated Manager' }, { value: '—' }, { value: '✓' }] },
      ],
      striped: true,
      bordered: false,
      responsive: true,
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'caption', type: 'text', label: 'Table Caption' },
      {
        name: 'headers',
        type: 'array',
        label: 'Column Headers',
        subFields: [{ name: 'label', type: 'text', label: 'Header Label', required: true }],
      },
      { name: 'striped', type: 'checkbox', label: 'Striped Rows' },
      { name: 'bordered', type: 'checkbox', label: 'Show Borders' },
    ],
  },

  'timeline-block': {
    blockType: 'timeline-block',
    label: 'Timeline',
    icon: '📅',
    category: 'Content',
    defaultData: {
      title: 'Our Journey',
      subtitle: 'How we grew to serve 500+ practices.',
      layout: 'vertical',
      items: [
        { date: '2015', title: 'Founded', description: 'Started with a vision to transform healthcare marketing.', icon: '🚀', accentColor: '#0ea5e9' },
        { date: '2018', title: '100 Clients', description: 'Reached our first 100 healthcare practice clients.', icon: '🏆', accentColor: '#6366f1' },
        { date: '2022', title: 'National Expansion', description: 'Expanded to serve practices across all 50 states.', icon: '🌎', accentColor: '#10b981' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Alternating', value: 'alternating' },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Timeline Events',
        subFields: [
          { name: 'date', type: 'text', label: 'Date / Year' },
          { name: 'title', type: 'text', label: 'Event Title', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'icon', type: 'text', label: 'Icon (emoji)' },
          { name: 'accentColor', type: 'text', label: 'Accent Color (hex)' },
        ],
      },
    ],
  },

  'steps-block': {
    blockType: 'steps-block',
    label: 'Steps / Process',
    icon: '📶',
    category: 'Content',
    defaultData: {
      title: 'How It Works',
      subtitle: 'Three simple steps to grow your practice.',
      layout: 'horizontal',
      accentColor: '#0ea5e9',
      steps: [
        { icon: '', title: 'Schedule a Call', description: 'Tell us about your practice and growth goals.' },
        { icon: '', title: 'Get Your Strategy', description: 'We build a custom marketing plan for your market.' },
        { icon: '', title: 'Watch It Grow', description: 'We execute, you see results — month after month.' },
      ],
    },
    fields: [
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Numbered Cards', value: 'cards' },
        ],
      },
      { name: 'accentColor', type: 'text', label: 'Accent Color (hex)' },
      {
        name: 'steps',
        type: 'array',
        label: 'Steps',
        subFields: [
          { name: 'icon', type: 'text', label: 'Icon (emoji, overrides number)' },
          { name: 'title', type: 'text', label: 'Step Title', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
        ],
      },
    ],
  },

  'announcement-bar-block': {
    blockType: 'announcement-bar-block',
    label: 'Announcement Bar',
    icon: '📣',
    category: 'Conversion',
    defaultData: {
      message: '🎉 Limited offer: Free SEO audit for new clients this month!',
      ctaLabel: 'Claim Offer',
      ctaHref: '/contact',
      style: 'brand',
      dismissible: true,
      icon: '',
    },
    fields: [
      { name: 'message', type: 'text', label: 'Message', required: true },
      { name: 'ctaLabel', type: 'text', label: 'Button Label' },
      { name: 'ctaHref', type: 'text', label: 'Button URL' },
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        options: [
          { label: 'Brand', value: 'brand' },
          { label: 'Dark', value: 'dark' },
          { label: 'Warning', value: 'warning' },
          { label: 'Success', value: 'success' },
          { label: 'Info', value: 'info' },
        ],
      },
      { name: 'dismissible', type: 'checkbox', label: 'Dismissible (show × button)' },
      { name: 'icon', type: 'text', label: 'Leading Icon (emoji, optional)' },
    ],
  },
};

// ─── Widget container block ───────────────────────────────────────────────────
// Only registered when the feature flag is enabled.
// Provides a blank canvas for placing widgets (heading, paragraph, image, etc.).

if (process.env.NEXT_PUBLIC_WIDGET_EDITOR === '1') {
  blockRegistry['widget-container'] = {
    blockType: 'widget-container',
    label: 'Widget Container',
    icon: '⊞',
    category: 'Layout',
    fields: [],
    defaultData: {},
  };
}

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
