import type { ParsedPage, SeoFields } from './types';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'our', 'you', 'are', 'was', 'were', 'have',
  'has', 'had', 'will', 'can', 'all', 'new', 'best', 'top', 'more', 'about', 'into', 'over', 'under',
  'how', 'what', 'when', 'where', 'why', 'who', 'whom', 'their', 'them', 'they', 'its', 'it', 'a', 'an',
  'of', 'to', 'in', 'on', 'at', 'by', 'as', 'is', 'be', 'or', 'not', 'do', 'does', 'did',
]);

function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function extractKeywords(page: ParsedPage): string {
  const freq = new Map<string, number>();
  for (const section of page.sections) {
    for (const heading of section.headings) {
      const words = heading
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

      for (const word of words) {
        freq.set(word, (freq.get(word) ?? 0) + 1);
      }
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
    .join(', ');
}

export function buildSeo(page: ParsedPage, slug: string): SeoFields {
  const firstSection = page.sections[0];
  const fallbackTitle = firstSection?.headings?.[0] ?? slug;
  const title = cleanText(page.title || fallbackTitle || slug);

  const firstTwoParas = firstSection?.paragraphs?.slice(0, 2).join(' ') ?? '';
  const fallbackDescription = cleanText(firstTwoParas);
  const description = truncate(cleanText(page.description || fallbackDescription), 160);

  const keywords = extractKeywords(page);

  return {
    title: title || slug,
    description: description || undefined,
    keywords: keywords || undefined,
    canonicalURL: '',
    noindex: false,
  };
}
