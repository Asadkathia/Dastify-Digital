import fs from 'node:fs';
import path from 'node:path';

type BrandBookSummary = {
  sourceTitle: string;
  fontFamilies: string[];
  colorTokens: string[];
  easingTokens: string[];
  sectionPatterns: string[];
  motionPatterns: string[];
};

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function extractMatches(source: string, pattern: RegExp): string[] {
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    matches.push(match[1]?.trim() ?? '');
  }
  return matches;
}

function parseBrandBookHtml(html: string): BrandBookSummary {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const familyMatches = extractMatches(html, /family=([^:&"']+)/g).map((value) => decodeURIComponent(value).replace(/\+/g, ' '));
  const variableMatches = extractMatches(html, /--([a-z0-9-]+)\s*:\s*([^;]+);/gi).map((value) => value);
  const easingMatches = extractMatches(html, /--([a-z0-9-]*ease[a-z0-9-]*)\s*:\s*([^;]+);/gi).map((value) => value);
  const sectionMatches = extractMatches(html, /\.([a-z0-9-]+(?:card|frame|stage|badge|title|desc|wrap))/gi);
  const motionMatches = extractMatches(html, /@keyframes\s+([a-z0-9-]+)/gi);

  return {
    sourceTitle: titleMatch?.[1]?.trim() || 'Dastify Digital Brand Book',
    fontFamilies: uniq(familyMatches).slice(0, 8),
    colorTokens: uniq(variableMatches.filter((value) => /#|rgba|gradient/i.test(value))).slice(0, 18),
    easingTokens: uniq(easingMatches).slice(0, 8),
    sectionPatterns: uniq(sectionMatches).slice(0, 12),
    motionPatterns: uniq(motionMatches).slice(0, 16),
  };
}

export function getBrandBookPromptSummary(): string {
  const brandbookPath = path.resolve(process.cwd(), '..', 'dastify-digital-animated-sections.html');
  if (!fs.existsSync(brandbookPath)) {
    return 'Brand book unavailable. Fall back to repo globals.css tokens and existing Dastify component language.';
  }

  const html = fs.readFileSync(brandbookPath, 'utf8');
  const parsed = parseBrandBookHtml(html);

  return [
    `Brand book source: ${parsed.sourceTitle}`,
    `Fonts: ${parsed.fontFamilies.join(', ') || 'Use existing Dastify typography tokens.'}`,
    `Color and material tokens: ${parsed.colorTokens.join(' | ') || 'Use existing Dastify color system.'}`,
    `Motion/easing tokens: ${parsed.easingTokens.join(' | ') || 'Preserve current Dastify motion feel.'}`,
    `Section/class motifs: ${parsed.sectionPatterns.join(', ') || 'Keep existing page-scoped naming.'}`,
    `Animation motifs: ${parsed.motionPatterns.join(', ') || 'Use subtle editor-safe motion patterns.'}`,
    'Brand constraints: bold editorial display typography, restrained body type, cream/ink foundations, electric accent moments, page-scoped visual motifs, production-ready motion naming, and no generic SaaS styling.',
  ].join('\n');
}
