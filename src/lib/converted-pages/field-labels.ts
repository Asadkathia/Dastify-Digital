export type FieldGroup = 'Content' | 'Images' | 'CTAs' | 'Lists' | 'Forms' | 'SEO' | 'Advanced';

export const FIELD_GROUP_ORDER: ReadonlyArray<FieldGroup> = [
  'Content',
  'Images',
  'CTAs',
  'Lists',
  'Forms',
  'SEO',
  'Advanced',
];

const IMAGE_TAILS = new Set([
  'image',
  'logo',
  'logoimage',
  'photo',
  'avatar',
  'bg',
  'background',
  'backgroundimage',
  'mapimage',
  'thumbnail',
  'icon',
]);

function splitCamel(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function humanizeSegment(seg: string): string {
  return titleCase(splitCamel(seg).replace(/[._-]+/g, ' '));
}

/** Drop common parent prefixes and tail-tune for human readability. */
export function smartLabel(dottedPath: string): string {
  const segments = dottedPath.split('.').filter((s) => s.length > 0);
  if (segments.length === 0) return dottedPath;
  const tail = segments[segments.length - 1];
  const tailLower = tail.toLowerCase();
  const parent = segments.length >= 2 ? segments[segments.length - 2] : '';

  // exact tail href or url -> URL
  if (tailLower === 'href' || tailLower === 'url') {
    // Special-case <something>Cta.href via parent path -> "<Parent> URL"
    if (/cta$/i.test(parent)) {
      const parentPretty = humanizeSegment(parent.replace(/cta$/i, '')) || 'CTA';
      return `${parentPretty} CTA URL`.replace(/\s+/g, ' ').trim();
    }
    return 'URL';
  }

  if (tailLower === 'alt') return 'Image Alt Text';

  // tail "label" with parent ending in cta
  if (tailLower === 'label' && /cta$/i.test(parent)) {
    const parentPretty = humanizeSegment(parent.replace(/cta$/i, '')) || 'CTA';
    return `${parentPretty} CTA Label`.replace(/\s+/g, ' ').trim();
  }

  if (tailLower === 'id') return 'ID';
  if (tailLower === 'slug') return 'Slug';

  if (tailLower === 'embedhtml') return 'Embed HTML';
  if (tailLower === 'embedurl') return 'Embed URL';
  if (tailLower === 'embedcode') return 'Embed Code';

  if (tailLower === 'ctalabel') return 'CTA Label';
  if (tailLower === 'ctahref' || tailLower === 'ctaurl') return 'CTA URL';

  // Default: humanize last segment only.
  return humanizeSegment(tail);
}

/** Categorize a flat-path field by its name + value-derived hints. */
export function categorizeField(input: {
  name: string;
  fieldType: string;
  isJsonField: boolean;
}): FieldGroup {
  const { name, fieldType, isJsonField } = input;
  if (isJsonField) return 'Advanced';

  if (fieldType === 'upload' || fieldType === 'icon-upload') return 'Images';

  const segments = name.split('.').filter(Boolean);
  const top = segments[0]?.toLowerCase() ?? '';
  const tail = segments[segments.length - 1]?.toLowerCase() ?? '';
  const tailNoNum = /^\d+$/.test(tail) && segments.length >= 2
    ? segments[segments.length - 2].toLowerCase()
    : tail;

  if (IMAGE_TAILS.has(tailNoNum)) return 'Images';

  // CTA: anywhere in the dotted path (case-insensitive) or tail href|url|link
  if (/cta/i.test(name)) return 'CTAs';
  if (tailNoNum === 'href' || tailNoNum === 'url' || tailNoNum === 'link') return 'CTAs';

  if (top === 'meta' || top === 'seo') return 'SEO';

  if (fieldType === 'array') return 'Lists';

  if (top === 'form' || tailNoNum === 'formid' || tailNoNum === 'formname' || /form/i.test(top)) {
    return 'Forms';
  }

  return 'Content';
}
