import type React from 'react';
import type { ConvertedNodeStyles } from '@/lib/converted-pages/types';
import { getValueAtPath, sanitizeNodeKey } from '@/lib/converted-pages/object-path';

type BindingOptions = {
  field: string;
  defaultTag: keyof React.JSX.IntrinsicElements;
  nodeKey?: string;
  allowedTags?: Array<keyof React.JSX.IntrinsicElements>;
  tagField?: string;
  styleField?: string;
};

const STYLE_KEYS: Array<keyof ConvertedNodeStyles> = [
  'color',
  'backgroundColor',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'textAlign',
  'marginTop',
  'marginBottom',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'borderColor',
  'borderWidth',
  'borderRadius',
];

function styleToReact(styles: ConvertedNodeStyles | null | undefined): React.CSSProperties {
  if (!styles) return {};
  const out: React.CSSProperties = {};
  for (const key of STYLE_KEYS) {
    const value = styles[key];
    if (value == null || value === '') continue;
    out[key] = value as never;
  }
  return out;
}

function resolveTag(
  source: unknown,
  tagField: string | undefined,
  defaultTag: keyof React.JSX.IntrinsicElements,
  allowedTags: Array<keyof React.JSX.IntrinsicElements> | undefined,
): keyof React.JSX.IntrinsicElements {
  const value = typeof tagField === 'string' ? getValueAtPath(source, tagField) : undefined;
  if (typeof value === 'string' && (!allowedTags || allowedTags.includes(value as keyof React.JSX.IntrinsicElements))) {
    return value as keyof React.JSX.IntrinsicElements;
  }
  return defaultTag;
}

export function getConvertedNodeBinding(
  source: unknown,
  {
    field,
    defaultTag,
    nodeKey: nodeKeyProp,
    allowedTags,
    tagField,
    styleField,
  }: BindingOptions,
) {
  const nodeKey = nodeKeyProp ?? sanitizeNodeKey(field);
  const resolvedTagField = tagField ?? `editor.nodes.${nodeKey}.tag`;
  const resolvedStyleField = styleField ?? `editor.nodes.${nodeKey}.styles`;
  const Tag = resolveTag(source, resolvedTagField, defaultTag, allowedTags);
  const styles = getValueAtPath(source, resolvedStyleField) as ConvertedNodeStyles | undefined;

  return {
    Tag,
    nodeKey,
    props: {
      'data-field': field,
      'data-style-field': resolvedStyleField,
      'data-tag-field': allowedTags && allowedTags.length > 0 ? resolvedTagField : undefined,
      'data-allowed-tags': allowedTags && allowedTags.length > 0 ? allowedTags.join(',') : undefined,
      style: styleToReact(styles),
    },
  };
}

// ─── Image binding ────────────────────────────────────────────────────────────

/**
 * Canonical shape for editable images stored in converted-page content.
 * Backwards-compat: callers may still pass a bare string URL at the field path —
 * `getConvertedImageBinding` normalizes it to `{ url }` on read.
 */
export type EditableImage = {
  /** Payload Media collection ID (source of truth after upload). */
  mediaId?: number | string;
  /** Resolved URL — populated on upload, used for SSR render. */
  url?: string;
  /** Alt text — separate inline-editable field. */
  alt?: string;
};

type ImageBindingOptions = {
  /** Dotted path to the image slot in the section data. */
  field: string;
  /**
   * Optional dotted path to the alt-text field. Defaults to `<field>.alt`
   * which co-locates alt with the image object (works automatically for the
   * canonical EditableImage shape).
   */
  altField?: string;
  /** Default alt text to render when neither the field value nor altField is set. */
  defaultAlt?: string;
  /** Optional dotted path used by the Inspector to drive the style overrides. */
  styleField?: string;
  /** Stable key for editor.nodes overrides; defaults to a sanitized version of `field`. */
  nodeKey?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Normalize a stored value (string URL, EditableImage, or null) into EditableImage. */
function normalizeImageValue(value: unknown): EditableImage {
  if (typeof value === 'string') {
    return value ? { url: value } : {};
  }
  if (isPlainObject(value)) {
    const v = value as Record<string, unknown>;
    const out: EditableImage = {};
    if (typeof v.url === 'string' && v.url) out.url = v.url;
    else if (typeof v.src === 'string' && v.src) out.url = v.src;
    if (typeof v.alt === 'string') out.alt = v.alt;
    if (typeof v.mediaId === 'number' || typeof v.mediaId === 'string') out.mediaId = v.mediaId as number | string;
    else if (typeof v.id === 'number' || (typeof v.id === 'string' && v.id)) out.mediaId = v.id as number | string;
    return out;
  }
  return {};
}

/**
 * Bind an image slot for inline editing. Renders to the live `<img>` when
 * `hasImage` is true, otherwise the caller is expected to render a `.iph`
 * placeholder (brand-book Rule 03).
 *
 * The returned `props` carry:
 *   - `data-field`: dotted path of the image slot
 *   - `data-image-field="true"`: signals the editor canvas to open an upload panel
 *   - `data-alt-field`: dotted path of the alt-text field
 *   - `data-style-field`: dotted path used by the inspector for style overrides
 *
 * Anything tagged with `data-image-field` becomes uploadable in the visual
 * editor — components do not need to opt in by name.
 */
export function getConvertedImageBinding(
  source: unknown,
  { field, altField, defaultAlt, styleField, nodeKey: nodeKeyProp }: ImageBindingOptions,
) {
  const resolvedAltField = altField ?? `${field}.alt`;
  const nodeKey = nodeKeyProp ?? sanitizeNodeKey(field);
  const resolvedStyleField = styleField ?? `editor.nodes.${nodeKey}.styles`;
  const resolvedHiddenField = `editor.nodes.${nodeKey}.hidden`;

  const raw = getValueAtPath(source, field);
  const normalized = normalizeImageValue(raw);

  // Alt: prefer altField at its own path, then fall back to the normalized
  // .alt baked into the EditableImage object, then defaultAlt.
  const externalAlt = getValueAtPath(source, resolvedAltField);
  const alt =
    typeof externalAlt === 'string' && externalAlt
      ? externalAlt
      : normalized.alt ?? defaultAlt ?? '';

  const src = normalized.url ?? '';
  const hasImage = src.length > 0;

  const styles = getValueAtPath(source, resolvedStyleField) as ConvertedNodeStyles | undefined;
  const hidden = getValueAtPath(source, resolvedHiddenField) === true;

  return {
    src,
    alt,
    hasImage,
    hidden,
    mediaId: normalized.mediaId,
    nodeKey,
    props: {
      'data-field': field,
      'data-image-field': 'true' as const,
      'data-alt-field': resolvedAltField,
      'data-style-field': resolvedStyleField,
      'data-image-hidden-field': resolvedHiddenField,
      style: styleToReact(styles),
    },
  };
}
