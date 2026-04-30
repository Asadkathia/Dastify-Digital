import type { ConvertedPageContentConfig } from './types';

const CONTENT_CONFIG: Record<string, ConvertedPageContentConfig> = {
  home: {
    pageName: 'home',
    contentFile: 'src/app/(site)/home/content.ts',
    sections: [
      { key: 'hero',         label: 'Hero',          icon: '🦸' },
      { key: 'trustBar',     label: 'Trust Bar',     icon: '🛡️' },
      { key: 'services',     label: 'Services',      icon: '🧩' },
      { key: 'growthFunnel', label: 'Growth Funnel', icon: '🔻' },
      { key: 'results',      label: 'Results',       icon: '📈' },
      { key: 'testimonial',  label: 'Testimonial',   icon: '💬' },
      { key: 'weServe',      label: 'We Serve',      icon: '🩺' },
      { key: 'aboutPreview', label: 'About Preview', icon: '📖' },
      { key: 'pricing',      label: 'Pricing',       icon: '💰' },
      { key: 'blogPreview',  label: 'Blog Preview',  icon: '📰' },
      { key: 'finalCta',     label: 'Final CTA',     icon: '📢' },
    ],
  },
  about: {
    pageName: 'about',
    contentFile: 'src/app/(site)/about/content.ts',
    sections: [
      { key: 'hero',           label: 'Hero',           icon: '🦸' },
      { key: 'missionVision',  label: 'Mission/Vision', icon: '🎯' },
      { key: 'coreValues',     label: 'Core Values',    icon: '💎' },
      { key: 'stats',          label: 'Stats',          icon: '📊' },
      { key: 'timeline',       label: 'Timeline',       icon: '🕰️' },
      { key: 'trust',          label: 'Trust',          icon: '🤝' },
      { key: 'certifications', label: 'Certifications', icon: '🏅' },
      { key: 'finalCta',       label: 'Final CTA',      icon: '📢' },
    ],
  },
  'services-convert': {
    pageName: 'services-convert',
    contentFile: 'src/app/(site)/services-convert/content.ts',
    sections: [
      { key: 'hero',         label: 'Hero',          icon: '🦸' },
      { key: 'stats',        label: 'Stats Bar',     icon: '📊' },
      { key: 'comparison',   label: 'Comparison',    icon: '⚖️' },
      { key: 'growthFunnel', label: 'Growth Funnel', icon: '🔻' },
      { key: 'whyDifferent', label: 'Why Different', icon: '💡' },
      { key: 'formula',      label: 'Formula',       icon: '🧪' },
      { key: 'setsApart',    label: 'Sets Apart',    icon: '✨' },
      { key: 'process',      label: 'Process',       icon: '⚙️' },
      { key: 'ctaBanner',    label: 'CTA Banner',    icon: '📢' },
      { key: 'specialties',  label: 'Specialties',   icon: '🩺' },
      { key: 'faqs',         label: 'FAQs',          icon: '❓' },
    ],
  },
  'case-studies': {
    pageName: 'case-studies',
    contentFile: 'src/app/(site)/case-studies/content.ts',
    sections: [
      { key: 'hero',        label: 'Hero',         icon: '🦸' },
      { key: 'caseStudies', label: 'Case Studies', icon: '📊' },
    ],
  },
  contact: {
    pageName: 'contact',
    contentFile: 'src/app/(site)/contact/content.ts',
    sections: [
      { key: 'hero', label: 'Hero', icon: '🦸' },
      { key: 'form', label: 'Form', icon: '✉️' },
      { key: 'info', label: 'Info', icon: 'ℹ️' },
    ],
  },
  'book-session': {
    pageName: 'book-session',
    contentFile: 'src/app/(site)/book-session/content.ts',
    sections: [
      { key: 'hero',      label: 'Hero',      icon: '🦸' },
      { key: 'scheduler', label: 'Scheduler', icon: '📅' },
      { key: 'form',      label: 'Form',      icon: '📝' },
      { key: 'sidebar',   label: 'Sidebar',   icon: '📋' },
    ],
  },
  'blog-1': {
    pageName: 'blog-1',
    contentFile: 'src/app/(site)/blog-1/content.ts',
    sections: [
      { key: 'hero', label: 'Hero', icon: '🦸' },
      { key: 'main', label: 'Featured + Grid', icon: '📰' },
    ],
  },
  'blog-post': {
    pageName: 'blog-post',
    contentFile: 'src/app/(site)/blog-post/content.ts',
    sections: [
      { key: 'hero',    label: 'Article Hero', icon: '📰' },
      { key: 'article', label: 'Article Body', icon: '📄' },
      { key: 'related', label: 'Related Posts', icon: '🔗' },
    ],
  },
};
export function getConvertedPageContentConfig(pageName: string): ConvertedPageContentConfig | null {
  return CONTENT_CONFIG[pageName] ?? null;
}

export function getAllConvertedPageContentConfigs(): ConvertedPageContentConfig[] {
  return Object.values(CONTENT_CONFIG);
}

export async function loadConvertedPageContent(pageName: string): Promise<Record<string, unknown> | null> {
  const config = CONTENT_CONFIG[pageName];
  if (!config) return null;

  try {
    const mod = await import(`../../../src/app/(site)/${pageName}/content`);
    return (mod.defaultContent ?? mod.default ?? null) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}
