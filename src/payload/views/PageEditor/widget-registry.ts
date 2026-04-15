import type { WidgetDefinition, WidgetInstance } from './types';

// ─── Widget Registry ──────────────────────────────────────────────────────────
// Phase 1: heading widget only. More added in Phase 2.

export const widgetRegistry: Record<string, WidgetDefinition> = {
  heading: {
    widgetType: 'heading',
    label: 'Heading',
    icon: 'H',
    category: 'Basic',
    fields: [
      { name: 'text', type: 'text', label: 'Text', required: true },
      {
        name: 'level',
        type: 'select',
        label: 'Level',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' },
        ],
      },
    ],
    defaultData: { text: 'Your Heading', level: 'h2' },
  },

  paragraph: {
    widgetType: 'paragraph',
    label: 'Paragraph',
    icon: '¶',
    category: 'Basic',
    fields: [{ name: 'text', type: 'textarea', label: 'Text', required: true }],
    defaultData: { text: 'Your paragraph text goes here.' },
  },

  button: {
    widgetType: 'button',
    label: 'Button',
    icon: '⬛',
    category: 'Basic',
    fields: [
      { name: 'label', type: 'text', label: 'Label', required: true },
      { name: 'link', type: 'link', label: 'Link' },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
        ],
      },
    ],
    defaultData: { label: 'Click Here', link: { url: '#', type: 'internal' }, variant: 'solid' },
  },

  image: {
    widgetType: 'image',
    label: 'Image',
    icon: '🖼',
    category: 'Media',
    fields: [
      { name: 'src', type: 'upload', label: 'Image' },
      { name: 'alt', type: 'text', label: 'Alt Text' },
    ],
    defaultData: { src: null, alt: '' },
  },

  spacer: {
    widgetType: 'spacer',
    label: 'Spacer',
    icon: '↕',
    category: 'Basic',
    fields: [{ name: 'height', type: 'text', label: 'Height (px)' }],
    defaultData: { height: '32' },
  },

  divider: {
    widgetType: 'divider',
    label: 'Divider',
    icon: '─',
    category: 'Basic',
    fields: [],
    defaultData: {},
  },

  badge: {
    widgetType: 'badge',
    label: 'Badge',
    icon: '◉',
    category: 'Basic',
    fields: [
      { name: 'text', type: 'text', label: 'Text', required: true },
      {
        name: 'color',
        type: 'select',
        label: 'Color',
        options: [
          { label: 'Blue', value: 'blue' },
          { label: 'Purple', value: 'purple' },
          { label: 'Green', value: 'green' },
          { label: 'Orange', value: 'orange' },
          { label: 'Red', value: 'red' },
          { label: 'Gray', value: 'gray' },
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
    ],
    defaultData: { text: 'New', color: 'blue', size: 'md' },
  },

  list: {
    widgetType: 'list',
    label: 'List',
    icon: '☰',
    category: 'Basic',
    fields: [
      { name: 'items', type: 'textarea', label: 'Items (one per line)', required: true },
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        options: [
          { label: 'Bullet', value: 'bullet' },
          { label: 'Numbered', value: 'numbered' },
          { label: 'Check', value: 'check' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
    defaultData: { items: 'First item\nSecond item\nThird item', style: 'bullet' },
  },

  icon: {
    widgetType: 'icon',
    label: 'Icon',
    icon: '★',
    category: 'Basic',
    fields: [
      { name: 'emoji', type: 'text', label: 'Emoji / Symbol' },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small (24px)', value: 'sm' },
          { label: 'Medium (40px)', value: 'md' },
          { label: 'Large (64px)', value: 'lg' },
          { label: 'XL (96px)', value: 'xl' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Align',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
    defaultData: { emoji: '⭐', size: 'md', align: 'left' },
  },

  video: {
    widgetType: 'video',
    label: 'Video',
    icon: '▶',
    category: 'Media',
    fields: [
      { name: 'url', type: 'text', label: 'YouTube / Vimeo URL' },
      { name: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: [
        { label: '16:9', value: '16/9' },
        { label: '4:3', value: '4/3' },
        { label: '1:1', value: '1/1' },
        { label: '9:16', value: '9/16' },
      ]},
    ],
    defaultData: { url: '', aspectRatio: '16/9' },
  },

  columns: {
    widgetType: 'columns',
    label: 'Columns',
    icon: '⊞',
    category: 'Layout',
    isContainer: true,
    fields: [
      {
        name: 'columnCount',
        type: 'select',
        label: 'Columns',
        options: [
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' },
        ],
      },
      { name: 'gap', type: 'select', label: 'Gap', options: [
        { label: 'None', value: '0' },
        { label: 'Small (8px)', value: '8' },
        { label: 'Medium (16px)', value: '16' },
        { label: 'Large (32px)', value: '32' },
        { label: 'XL (48px)', value: '48' },
      ]},
    ],
    defaultData: { columnCount: '2', gap: '16' },
  },
};

export const widgetCategories: Array<{ name: string; widgets: WidgetDefinition[] }> = [
  { name: 'Basic', widgets: Object.values(widgetRegistry).filter((w) => w.category === 'Basic') },
  { name: 'Media', widgets: Object.values(widgetRegistry).filter((w) => w.category === 'Media') },
  { name: 'Layout', widgets: Object.values(widgetRegistry).filter((w) => w.category === 'Layout') },
  { name: 'Interactive', widgets: Object.values(widgetRegistry).filter((w) => w.category === 'Interactive') },
].filter((cat) => cat.widgets.length > 0);

export function getWidgetDefinition(widgetType: string): WidgetDefinition | undefined {
  return widgetRegistry[widgetType];
}

export function createWidgetInstance(widgetType: string): WidgetInstance | null {
  const def = getWidgetDefinition(widgetType);
  if (!def) return null;
  return {
    id: `widget-${widgetType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    widgetType,
    data: structuredClone(def.defaultData),
  };
}
