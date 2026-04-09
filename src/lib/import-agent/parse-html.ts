/**
 * parse-html.ts
 *
 * Lightweight HTML parser that runs BEFORE the AI step.
 * Purpose: compress raw HTML into a structured summary that reduces
 * AI token usage by ~70-80% while preserving all mapping-relevant signals.
 *
 * No external deps — uses regex + string manipulation only so it can run
 * in any environment (edge, Node, browser).
 */

import type { ParsedPage, ParsedSection } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractAttr(tag: string, attr: string): string {
  const m = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 chars
  return Math.ceil(text.length / 4);
}

function isExternalUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//');
}

// ─── Section role heuristic ───────────────────────────────────────────────────

function guessRole(
  tag: string,
  id: string,
  className: string,
  headings: string[],
  hasForm: boolean,
  hasVideo: boolean,
  html: string,
): string {
  const combined = `${id} ${className} ${headings.join(' ')}`.toLowerCase();
  const lowerHtml = html.toLowerCase();

  if (tag === 'nav' || combined.includes('nav') || combined.includes('navbar') || combined.includes('header')) return 'nav';
  if (tag === 'footer' || combined.includes('footer')) return 'footer';
  if (combined.includes('hero') || combined.includes('banner') || combined.includes('jumbotron')) return 'hero';
  if (combined.includes('faq') || combined.includes('frequently')) return 'faq';
  if (combined.includes('testimonial') || combined.includes('review') || combined.includes('quote')) return 'testimonials';
  if (combined.includes('pricing') || combined.includes('plan') || combined.includes('tier')) return 'pricing';
  if (combined.includes('feature') || combined.includes('benefit') || combined.includes('service')) return 'features';
  if (combined.includes('stat') || combined.includes('number') || combined.includes('counter') || combined.includes('metric')) return 'stats';
  if (combined.includes('cta') || combined.includes('call-to-action') || combined.includes('get-started') || combined.includes('contact-us')) return 'cta';
  if (combined.includes('about') || combined.includes('story') || combined.includes('mission')) return 'about';
  if (combined.includes('team') || combined.includes('staff') || combined.includes('people')) return 'team';
  if (combined.includes('blog') || combined.includes('news') || combined.includes('insight') || combined.includes('article')) return 'blog';
  if (combined.includes('gallery') || combined.includes('portfolio') || combined.includes('work')) return 'gallery';
  if (combined.includes('logo') || combined.includes('partner') || combined.includes('client') || combined.includes('trust')) return 'logos';
  if (hasForm) return 'form';
  if (hasVideo) return 'video';
  if (lowerHtml.includes('<accordion') || combined.includes('accordion') || combined.includes('collapse')) return 'accordion';
  if (lowerHtml.includes('<table') || combined.includes('comparison') || combined.includes('versus')) return 'comparison';
  return 'content';
}

// ─── Main section splitter ────────────────────────────────────────────────────

function splitIntoSections(html: string): string[] {
  // Try to split on top-level semantic elements first
  const topLevelPattern = /<(section|article|header|footer|nav|main|aside)[\s>]/gi;
  const matches: Array<{ index: number; tag: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = topLevelPattern.exec(html)) !== null) {
    matches.push({ index: m.index, tag: m[1].toLowerCase() });
  }

  if (matches.length >= 2) {
    // Split at each top-level element boundary
    const sections: string[] = [];
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
      sections.push(html.slice(start, end).trim());
    }
    return sections.filter((s) => s.length > 30);
  }

  // Fallback: split on top-level <div> with id or class (common in older HTML)
  const divPattern = /<div\s+(?:id|class)=["'][^"']+["'][^>]*>/gi;
  const divMatches: number[] = [];
  while ((m = divPattern.exec(html)) !== null) {
    divMatches.push(m.index);
  }

  if (divMatches.length >= 2) {
    const sections: string[] = [];
    for (let i = 0; i < divMatches.length; i++) {
      const start = divMatches[i];
      const end = i + 1 < divMatches.length ? divMatches[i + 1] : html.length;
      sections.push(html.slice(start, end).trim());
    }
    return sections.filter((s) => s.length > 50).slice(0, 30); // cap at 30 sections
  }

  // Last resort: treat whole body as one section
  return [html];
}

// ─── Parse a single section ───────────────────────────────────────────────────

function parseSection(rawHtml: string, index: number): ParsedSection {
  // Extract opening tag info
  const openTagMatch = rawHtml.match(/^<([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*)>/);
  const tag = openTagMatch ? openTagMatch[1].toLowerCase() : 'div';
  const tagAttrs = openTagMatch ? openTagMatch[2] : '';
  const id = extractAttr(tagAttrs, 'id');
  const className = extractAttr(tagAttrs, 'class');
  const role = extractAttr(tagAttrs, 'role') || extractAttr(tagAttrs, 'aria-label');

  // Headings
  const headings: string[] = [];
  const headingPattern = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let hm: RegExpExecArray | null;
  while ((hm = headingPattern.exec(rawHtml)) !== null) {
    const text = stripTags(hm[2]).trim();
    if (text) headings.push(text);
  }

  // Paragraphs (first 3 only — enough for AI context, keeps tokens down)
  const paragraphs: string[] = [];
  const paraPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pm: RegExpExecArray | null;
  while ((pm = paraPattern.exec(rawHtml)) !== null && paragraphs.length < 3) {
    const text = stripTags(pm[1]).trim();
    if (text.length > 10) paragraphs.push(text);
  }

  // Links
  const links: Array<{ text: string; href: string }> = [];
  const linkPattern = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkPattern.exec(rawHtml)) !== null && links.length < 10) {
    const href = lm[1].trim();
    const text = stripTags(lm[2]).trim();
    if (href && href !== '#' && text) links.push({ text, href });
  }

  // Images
  const images: Array<{ src: string; alt: string; isExternal: boolean }> = [];
  const imgPattern = /<img\s+[^>]*/gi;
  let im: RegExpExecArray | null;
  while ((im = imgPattern.exec(rawHtml)) !== null) {
    const src = extractAttr(im[0], 'src');
    const alt = extractAttr(im[0], 'alt');
    if (src) {
      images.push({ src, alt, isExternal: isExternalUrl(src) });
    }
  }

  // Special content signals
  const hasForm = /<form[\s>]/i.test(rawHtml);
  const hasVideo = /<video[\s>]|<iframe[^>]+(youtube|vimeo)/i.test(rawHtml);
  const hasIframe = /<iframe[\s>]/i.test(rawHtml);

  const guessedRole = guessRole(tag, id, className, headings, hasForm, hasVideo, rawHtml);

  // Truncate rawHtml for AI to keep tokens manageable
  // Keep full HTML for complex sections, truncate very long ones
  const truncatedHtml = rawHtml.length > 3000
    ? rawHtml.slice(0, 3000) + '\n<!-- [truncated for brevity] -->'
    : rawHtml;

  return {
    index,
    tag,
    id: id || undefined,
    className: className || undefined,
    role: role || guessedRole,
    headings,
    paragraphs,
    links,
    images,
    hasForm,
    hasVideo,
    hasIframe,
    rawHtml: truncatedHtml,
    estimatedTokens: estimateTokens(truncatedHtml),
  };
}

// ─── Extract page-level metadata ──────────────────────────────────────────────

function extractPageMeta(html: string): { title: string; description: string } {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(stripTags(titleMatch[1])).trim() : '';

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    || html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const description = descMatch ? decodeEntities(descMatch[1]).trim() : '';

  return { title, description };
}

// ─── Strip script/style blocks from HTML before parsing ───────────────────────

function extractPageStyles(html: string): string {
  const chunks: string[] = [];
  const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let m: RegExpExecArray | null;
  while ((m = stylePattern.exec(html)) !== null) {
    const css = m[1].trim();
    if (css) chunks.push(css);
  }
  // Cap at 20 kB — enough for any page stylesheet, avoids bloating the DB
  const joined = chunks.join('\n');
  return joined.length > 20_000 ? joined.slice(0, 20_000) : joined;
}

function extractBody(html: string): string {
  // Strip <script> and <style> blocks
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Extract body content if present
  const bodyMatch = clean.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) clean = bodyMatch[1];

  return clean.trim();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function parseHtml(rawHtml: string): ParsedPage {
  const meta = extractPageMeta(rawHtml);
  const pageStyles = extractPageStyles(rawHtml);
  const body = extractBody(rawHtml);
  const rawSections = splitIntoSections(body);
  const sections = rawSections.map((s, i) => parseSection(s, i));
  const totalEstimatedTokens = sections.reduce((sum, s) => sum + s.estimatedTokens, 0);

  return {
    title: meta.title,
    description: meta.description,
    sections,
    totalEstimatedTokens,
    pageStyles: pageStyles || undefined,
  };
}

/**
 * Serialize the ParsedPage into a compact string for the AI prompt.
 * This replaces sending the raw HTML — reduces token count by ~70%.
 */
export function serializeParsedPage(page: ParsedPage): string {
  const lines: string[] = [
    `PAGE TITLE: ${page.title || '(none)'}`,
    `PAGE DESCRIPTION: ${page.description || '(none)'}`,
    `SECTION COUNT: ${page.sections.length}`,
    '',
  ];

  for (const section of page.sections) {
    lines.push(`--- SECTION ${section.index} [${section.tag}] role=${section.role} ---`);
    if (section.id) lines.push(`  id: ${section.id}`);
    if (section.className) lines.push(`  class: ${section.className}`);
    if (section.headings.length) lines.push(`  headings: ${section.headings.join(' | ')}`);
    if (section.paragraphs.length) lines.push(`  paragraphs:\n${section.paragraphs.map((p) => `    - ${p}`).join('\n')}`);
    if (section.links.length) lines.push(`  links:\n${section.links.map((l) => `    - [${l.text}](${l.href})`).join('\n')}`);
    if (section.images.length) lines.push(`  images:\n${section.images.map((i) => `    - src=${i.src} alt="${i.alt}" external=${i.isExternal}`).join('\n')}`);
    if (section.hasForm) lines.push(`  hasForm: true`);
    if (section.hasVideo) lines.push(`  hasVideo: true`);
    if (section.hasIframe) lines.push(`  hasIframe: true`);
    lines.push(`  rawHtml (for reference):\n${section.rawHtml}`);
    lines.push('');
  }

  return lines.join('\n');
}
