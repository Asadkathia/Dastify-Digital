import type { ConvertedPageRegistry } from './types';

export type SectionOverrideBreakpoint = 'desktop' | 'tablet' | 'mobile';

/** Reserved key under `convertedContent` where per-section style overrides live. */
export const SECTION_OVERRIDES_KEY = '_sectionOverrides';

/** Tailwind-ish breakpoint caps (mobile-last, max-width queries). */
export const BREAKPOINT_MAX_WIDTH: Record<SectionOverrideBreakpoint, number | null> = {
  desktop: null,   // no media query
  tablet: 1100,
  mobile: 768,
};

export type SectionOverrideValues = {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  minHeight?: string;
  gap?: string;
};

export type SectionOverrideRecord = Partial<Record<SectionOverrideBreakpoint, SectionOverrideValues>>;

/** Keyed by section key (matches `ConvertedSectionRendererSpec.key`). */
export type SectionOverrides = Record<string, SectionOverrideRecord>;

const CSS_PROP_MAP: Record<keyof SectionOverrideValues, string> = {
  paddingTop: 'padding-top',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  paddingRight: 'padding-right',
  marginTop: 'margin-top',
  marginBottom: 'margin-bottom',
  minHeight: 'min-height',
  gap: 'gap',
};

function renderRuleBody(values: SectionOverrideValues): string {
  const decls: string[] = [];
  for (const [key, value] of Object.entries(values) as [keyof SectionOverrideValues, string | undefined][]) {
    if (value == null || value === '') continue;
    // `!important` so overrides win against the minified page CSS that comes later
    decls.push(`${CSS_PROP_MAP[key]}: ${value} !important;`);
  }
  return decls.join(' ');
}

type SectionClassMap = Record<string, string>;

function buildSectionClassMap(registry: ConvertedPageRegistry): SectionClassMap {
  const map: SectionClassMap = {};
  for (const section of registry.sections) {
    if (section.className) map[section.key] = section.className;
  }
  return map;
}

/**
 * Emit a scoped CSS string for a page's section overrides.
 * Returns empty string when there's nothing to emit.
 */
export function generateOverrideCss(
  registry: ConvertedPageRegistry,
  overrides: SectionOverrides | null | undefined,
): string {
  if (!overrides) return '';

  const classMap = buildSectionClassMap(registry);
  const perBreakpoint: Record<SectionOverrideBreakpoint, string[]> = {
    desktop: [],
    tablet: [],
    mobile: [],
  };

  for (const [sectionKey, byBreakpoint] of Object.entries(overrides)) {
    const className = classMap[sectionKey];
    if (!className) continue;
    for (const bp of ['desktop', 'tablet', 'mobile'] as SectionOverrideBreakpoint[]) {
      const values = byBreakpoint[bp];
      if (!values) continue;
      const body = renderRuleBody(values);
      if (!body) continue;
      perBreakpoint[bp].push(`.${className} { ${body} }`);
    }
  }

  const parts: string[] = [];
  if (perBreakpoint.desktop.length) parts.push(perBreakpoint.desktop.join('\n'));
  if (perBreakpoint.tablet.length) {
    parts.push(`@media (max-width: ${BREAKPOINT_MAX_WIDTH.tablet}px) { ${perBreakpoint.tablet.join(' ')} }`);
  }
  if (perBreakpoint.mobile.length) {
    parts.push(`@media (max-width: ${BREAKPOINT_MAX_WIDTH.mobile}px) { ${perBreakpoint.mobile.join(' ')} }`);
  }
  return parts.join('\n');
}

/** Extract overrides out of convertedContent. */
export function extractSectionOverrides(
  convertedContent: Record<string, unknown> | null | undefined,
): SectionOverrides {
  if (!convertedContent) return {};
  const raw = convertedContent[SECTION_OVERRIDES_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw as SectionOverrides;
}
