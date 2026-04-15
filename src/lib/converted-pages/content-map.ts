import type { ConvertedPageContentConfig } from './types';

const CONTENT_CONFIG: Record<string, ConvertedPageContentConfig> = {
  demo: {
    pageName: 'demo',
    contentFile: 'src/app/(site)/demo/content.ts',
    sections: [
      { key: 'nav',         label: 'Navbar',      icon: '🧭' },
      { key: 'hero',        label: 'Hero',        icon: '🦸' },
      { key: 'process',     label: 'Process',     icon: '⚙️' },
      { key: 'results',     label: 'Results',     icon: '📈' },
      { key: 'testimonial', label: 'Testimonial', icon: '💬' },
      { key: 'urgency',     label: 'Urgency',     icon: '⚡' },
      { key: 'footer',      label: 'Footer',      icon: '🏁' },
    ],
  },
  about: {
    pageName: 'about',
    contentFile: 'src/app/(site)/about/content.ts',
    sections: [
      { key: 'nav', label: 'Navigation', icon: '🧭' },
      { key: 'hero', label: 'Hero', icon: '🦸' },
      { key: 'manifesto', label: 'Manifesto', icon: '📣' },
      { key: 'difference', label: 'Difference', icon: '✨' },
      { key: 'story', label: 'Story', icon: '🕰️' },
      { key: 'team', label: 'Team', icon: '👥' },
      { key: 'values', label: 'Values', icon: '💎' },
      { key: 'cta', label: 'CTA', icon: '🎯' },
      { key: 'footer', label: 'Footer', icon: '🏁' },
    ],
  },
  'services-convert': {
    pageName: 'services-convert',
    contentFile: 'src/app/(site)/services-convert/content.ts',
    sections: [
      { key: 'nav', label: 'Navigation', icon: '🧭' },
      { key: 'hero', label: 'Hero', icon: '🦸' },
      { key: 'services', label: 'Services', icon: '🧩' },
      { key: 'results', label: 'Results', icon: '📈' },
      { key: 'why', label: 'Why', icon: '💡' },
      { key: 'process', label: 'Process', icon: '⚙️' },
      { key: 'cta', label: 'CTA', icon: '🎯' },
      { key: 'footer', label: 'Footer', icon: '🏁' },
    ],
  },
  'contact-2': {
    pageName: 'contact-2',
    contentFile: 'src/app/(site)/contact-2/content.ts',
    sections: [
      { key: 'nav',         label: 'Navbar',      icon: '🧭' },
      { key: 'hero',        label: 'Hero',        icon: '🦸' },
      { key: 'methods',     label: 'Methods',     icon: '📞' },
      { key: 'contactForm', label: 'Contact Form', icon: '📋' },
      { key: 'map',         label: 'Map',         icon: '🗺️' },
      { key: 'faq',         label: 'FAQ',         icon: '❓' },
      { key: 'cta',         label: 'CTA',         icon: '🎯' },
      { key: 'footer',      label: 'Footer',      icon: '🏁' },
    ],
  },
  'blog-post': {
    pageName: 'blog-post',
    contentFile: 'src/app/(site)/blog-post/content.ts',
    sections: [
      { key: 'nav', label: 'Navbar', icon: '🧭' },
      { key: 'hero', label: 'Article Hero', icon: '📰' },
      { key: 'article', label: 'Article Body', icon: '📄' },
      { key: 'relatedPosts', label: 'Related Posts', icon: '🔗' },
      { key: 'cta', label: 'CTA', icon: '📣' },
      { key: 'footer', label: 'Footer', icon: '🦶' },
    ],
  },
  'blog-1': {
    pageName: 'blog-1',
    contentFile: 'src/app/(site)/blog-1/content.ts',
    sections: [
      { key: 'nav', label: 'Navbar', icon: '🧭' },
      { key: 'hero', label: 'Hero', icon: '🦸' },
      { key: 'filters', label: 'Filters', icon: '🏷️' },
      { key: 'featured', label: 'Featured Post', icon: '⭐' },
      { key: 'grid', label: 'Blog Grid', icon: '📰' },
      { key: 'topics', label: 'Topics', icon: '🗂️' },
      { key: 'newsletter', label: 'Newsletter', icon: '✉️' },
      { key: 'cta', label: 'CTA', icon: '🚀' },
      { key: 'footer', label: 'Footer', icon: '🦶' },
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
