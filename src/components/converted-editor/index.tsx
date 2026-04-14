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
