import { homepageContent, type HomepageContent } from './homepage-content.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Merge a Payload homepage global doc over the hard-coded defaults. Each
 * top-level section key in `HomepageContent` is shallow-merged — if the doc
 * provides a section, its fields override the default section. Missing or
 * invalid sections fall back to the defaults from `homepageContent`.
 *
 * This is intentionally simple: the new homepage shape is flat value objects
 * plus a few arrays, and the runtime render tolerates partial data.
 */
export function resolveHomepageContent(global: unknown): HomepageContent {
  if (!isRecord(global)) {
    return homepageContent;
  }

  const out: HomepageContent = { ...homepageContent };
  const keys: (keyof HomepageContent)[] = [
    'heroVariant',
    'hero',
    'trustBar',
    'services',
    'results',
    'testimonial',
    'weServe',
    'aboutPreview',
    'pricing',
    'blogPreview',
    'finalCta',
  ];

  for (const key of keys) {
    const value = (global as Record<string, unknown>)[key];
    if (key === 'heroVariant') {
      if (value === 'A' || value === 'B' || value === 'C') {
        out.heroVariant = value;
      }
      continue;
    }
    if (isRecord(value)) {
      const defaults = homepageContent[key] as Record<string, unknown>;
      (out as Record<string, unknown>)[key] = { ...defaults, ...value };
    }
  }

  return out;
}
