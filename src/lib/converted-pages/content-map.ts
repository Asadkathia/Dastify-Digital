import type { ConvertedPageContentConfig } from './types';

const CONTENT_CONFIG: Record<string, ConvertedPageContentConfig> = {
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
};

export function getConvertedPageContentConfig(pageName: string): ConvertedPageContentConfig | null {
  return CONTENT_CONFIG[pageName] ?? null;
}

export function getAllConvertedPageContentConfigs(): ConvertedPageContentConfig[] {
  return Object.values(CONTENT_CONFIG);
}

export async function loadConvertedPageContent(pageName: string): Promise<Record<string, unknown> | null> {
  if (pageName === 'about') {
    const mod = await import('@/app/(site)/about/content');
    return mod.defaultContent as unknown as Record<string, unknown>;
  }

  if (pageName === 'services-convert') {
    const mod = await import('@/app/(site)/services-convert/content');
    return mod.defaultContent as unknown as Record<string, unknown>;
  }

  return null;
}

