import type { AIMessage } from '@/lib/ai/types';
import { getBrandBookPromptSummary } from './brandbook';

/**
 * Builds the AI prompt for converting raw HTML into Next.js TSX components.
 *
 * The output is a JSON object containing:
 *   - components: array of { filename, code } TSX files
 *   - pageFile: the page.tsx entry point code
 *   - contentType: TypeScript type definition for the editable content
 *   - defaultContent: default content object matching that type
 *   - globalsCssAdditions: any new CSS classes needed (empty string if all existing classes suffice)
 */

const GLOBALS_CSS_CLASSES = `
Available CSS classes from globals.css (use these — do NOT write inline styles for things already covered):

LAYOUT:    .wrap (max-w 1320px, auto margins, 72px h-pad)  .sp (120px v-pad)  .sp-sm (80px v-pad)
BUTTONS:   .btn-dk (dark filled)  .btn-ol (outlined)  .btn-pu (purple filled)
CHIP:      .chip + .chip-dot (small label badge)
TEXT ANIM: .line-wrap > .line-inner (reveal animation, data-delay="1"–"4")
SCROLL:    data-r attr triggers reveal on scroll (opacity 0→1 + translateY)  data-r="L" (from left)  data-r="R" (from right) — NEVER put data-r on elements that re-render due to state changes (accordion rows, tab panels, toggles) — they lose the "revealed" class on re-render and disappear (opacity 0)
IMG:       .img-reveal (clip reveal on scroll)  .iph (image placeholder box)
WATERMARK: .sec-wm.g1/.g2/.g3 (giant letter watermark, position absolute)  .sec-wm.wm-wt (white)
NAV:       .nav  .nav.solid  .nav-logo  .nav-logo-dot  .nav-link  .nav-cta
TYPOGRAPHY: .masthead (clamp 48-100px, weight 900, lh .95, ls -.04em)  .display (clamp 36-64px, weight 800, lh 1.0, ls -.03em)  .h1 (clamp 32-52px, weight 800, lh 1.05, ls -.025em)  .h2 (clamp 24-42px, weight 700, lh 1.1, ls -.02em)  .h3 (clamp 18-28px, weight 700, lh 1.2, ls -.01em)  .lead (18px body text, weight 400, lh 1.7, color t2)
TOKENS:    --purple #7C3AED  --blue #0367a5  --green #7eb63e  --bg #F5F1E8  --bg2 #fff  --bg3 #EDE9DF  --ink #0E0E0C  --t2 rgba(14,14,12,.6)  --t3 rgba(14,14,12,.38)  --bd-dk rgba(14,14,12,.1)  --g1 gradient(135deg,purple,blue)  --g2 gradient(135deg,blue,green)  --g3 gradient(135deg,green,purple)  --g1-lt/g2-lt/g3-lt (7% opacity versions)  --purple-lt/bd  --blue-lt/bd  --green-lt/bd  --fd (Manrope)  --fb (Lato)  --expo cubic-bezier(0.16,1,0.3,1)  --spring cubic-bezier(0.34,1.56,0.64,1)
`.trim();

export function buildConverterPrompt(html: string, pageName: string): AIMessage[] {
  const brandBook = getBrandBookPromptSummary();
  const system = [
    'You are an expert Next.js developer converting raw HTML pages into pixel-perfect Next.js TSX components.',
    'Your output must be a single valid JSON object — no markdown, no explanation, just JSON.',
    '',
    'BRAND BOOK SUMMARY (follow this in addition to repo CSS tokens):',
    brandBook,
    '',
    'OUTPUT SCHEMA (return exactly this shape):',
    '{',
    '  "components": [{ "filename": "Hero.tsx", "code": "..." }, ...],',
    '  "pageFile": "...",',
    '  "contentType": "...",',
    '  "defaultContent": { ... },',
    '  "globalsCssAdditions": "..."',
    '}',
    '',
    '─── COMPONENT RULES ───',
    '1. Split the page into logical section components — one file per section (Hero, Navbar, Services, Results, WhySection, Process, Cta, Footer, etc.).',
    '2. Each component accepts a single `data` prop typed to a slice of the content type.',
    '2a. Components for converted pages must be editor-aware. Every editable text, link label, media slot, or semantic heading must bind to explicit field metadata in the rendered DOM.',
    '3. Use "use client" only when the component needs onClick/useState (accordion toggles, scroll listeners, tab switches). Server components by default.',
    '4. Preserve ALL animations, transitions, hover effects, and scroll reveal from the source HTML.',
    '5. For JavaScript behaviors (scroll nav, accordion expand, IntersectionObserver reveals): implement them as client components using useEffect/useState.',
    '6. Replace <img> with Next.js <Image> from "next/image" where possible. For placeholder boxes, preserve the box in JSX but model it as an editable media slot in content.',
    '7. Replace anchor tags on internal routes with Next.js <Link> from "next/link".',
    '8. Always use compound keys in .map() calls: key={`${parent}-${item.href ?? item.label}-${index}`} to avoid duplicate key warnings.',
    '8. Convert all CSS variables and class names to use the existing globals.css tokens listed below.',
    '9. For CSS not covered by globals.css classes, write scoped <style jsx> OR add to globalsCssAdditions.',
    '10. NEVER use Tailwind. NEVER use CSS modules. Use className with globals.css classes or inline style for one-offs.',
    '',
    '─── PAGE FILE RULES ───',
    `The pageFile is src/app/(site)/${pageName}/page.tsx.`,
    'It must be an async Server Component that:',
    '  - imports all section components from "./components/"',
    '  - imports { NavbarScrollState } from "@/app/components/home/NavbarScrollState" (named export)',
    '  - imports { ScrollRevealController } from "@/app/components/home/ScrollRevealController" (named export)',
    '  - accepts content from a hardcoded defaultContent object (passed as props to each component)',
    '  - exports generateMetadata() with title/description from the HTML <title> and <meta description>',
    '  - exports default async function Page()',
    '',
    '─── CONTENT TYPE RULES ───',
    'contentType is a TypeScript type declaration string (export type PageContent = { ... })',
    'It must contain every editable text string, link href, image src, semantic heading field, and structured editable style field in the page.',
    'Every section type should include optional editor metadata under `editor?: { nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }> }`.',
    'Use semantic fields like `titleTag` when a heading level should be selectable by the editor.',
    'When the source HTML contains an image placeholder box (especially .iph with .iph-ic/.iph-lbl/.iph-dim), represent it as a media-capable object or item that includes `image`, `imageAlt`, and placeholder metadata such as icon/label/dimensions. Also include image presentation fields like `imageFit`, `imagePosition`, `imageRadius`, plus placeholder chrome fields like `preservePlaceholderChrome`, `placeholderBackground`, `placeholderBorderColor`, `placeholderBorderWidth`, `placeholderBorderStyle`, `placeholderPadding`, `placeholderGap`, `placeholderRadius`, `placeholderShowOverlay`, and `placeholderOverlay`.',
    'Group fields by section: nav, hero, services, results, why, process, cta, footer etc.',
    'Use string[] for lists, { label: string; href: string }[] for link lists.',
    'For array/repeater content, preserve stable item structure so inline editing can target dotted paths like `items.0.title`.',
    '',
    '─── EDITOR BINDING RULES ───',
    'Render editable nodes with DOM metadata attributes:',
    '  - `data-field` for content path',
    '  - `data-style-field` for persisted style path',
    '  - `data-tag-field` for semantic tag path when applicable',
    '  - `data-allowed-tags` when semantic tag changes are allowed',
    'Prefer using helper bindings from `@/components/converted-editor` when practical.',
    'Every editable heading must support semantic tag switching through bound metadata.',
    'Every editable text/link/media node must preserve page-scoped class names and allow inspector-driven style persistence through structured fields, not raw CSS editing.',
    '',
    '─── CSS RULES ───',
    GLOBALS_CSS_CLASSES,
    '',
    'globalsCssAdditions: CRITICAL — you MUST include ALL CSS from the source <style> block that is not already in globals.css.',
    'Audit the source HTML <style> block line by line. For every class used in your JSX that is NOT in the globals.css list above, add it to globalsCssAdditions.',
    'Scope ALL new class names with the page slug prefix to avoid collisions (e.g. .services-stat-num { }).',
    'Do NOT use generic class names like .stat-num or .stat-lbl — these may not exist in globals.css. Always use prefixed names.',
    'If a component uses a class, that class MUST exist either in globals.css (listed above) or in globalsCssAdditions. No orphaned classes.',
    '',
    '─── FIDELITY RULES ───',
    '- Reproduce the exact layout: grid columns, gaps, padding, font sizes, font weights.',
    '- Reproduce gradients, background colors, border styles exactly.',
    '- Reproduce hover states and transitions using the same CSS.',
    '- Marquee animations, accordion expand/collapse, sticky nav scroll behavior — all must work.',
    '- Image placeholder boxes (.iph) should keep their emoji icon, label, and pixel dimensions as fallback placeholder metadata, but MUST also have editable image fields and placeholder-chrome fields so the visual editor can fully control the image slot before and after an image is uploaded.',
    '- Do NOT simplify or consolidate sections — keep every section from the source.',
    '',
    'Output must be a single JSON object parseable by JSON.parse().',
  ].join('\n');

  const user = [
    `Convert this HTML page to Next.js TSX components. Page name: "${pageName}".`,
    '',
    '```html',
    html,
    '```',
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}
