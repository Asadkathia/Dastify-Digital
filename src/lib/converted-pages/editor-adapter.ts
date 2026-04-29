import type { BlockDefinition, EditorField, SectionInstance } from '@/payload/views/PageEditor/types';
import type { ConvertedSectionSpec } from './types';
import { setValueAtPath } from './object-path';

type FlatRecord = Record<string, unknown>;

const META_PREFIX = '__';
const META_JSON_FIELDS = '__jsonFields';
const META_SECTION_KEY = '__sectionKey';
const META_SECTION_LABEL = '__sectionLabel';
const META_SECTION_ICON = '__sectionIcon';
const META_SECTION_HIDDEN = '__sectionHidden';
const META_TEMPLATE_KEY = '__templateKey';
// On the persisted page-content side, the hide flag lives directly on the
// section object as `__hidden` so the public renderer can read it without
// going through the editor adapter. See sectionsToConvertedPageContent /
// convertedPageContentToSections for the round-trip.
const PERSISTED_HIDDEN_KEY = '__hidden';

// ─── Reorder / duplicate / soft-delete (Option 2) ────────────────────────────
// Top-level meta keys persisted on convertedContent. All `__`-prefixed so the
// existing flatten/rebuild logic skips them naturally.
export const SECTION_ORDER_KEY = '__sectionOrder';
export const SECTION_INSTANCES_KEY = '__sectionInstances';
export const DELETED_SECTIONS_KEY = '__deletedSections';

export type SectionInstanceMeta = { templateKey: string; label?: string };
export type SectionInstancesMap = Record<string, SectionInstanceMeta>;

export function extractSectionOrder(content: Record<string, unknown> | null | undefined): string[] | null {
  if (!content) return null;
  const raw = content[SECTION_ORDER_KEY];
  if (!Array.isArray(raw)) return null;
  return raw.filter((v): v is string => typeof v === 'string');
}

export function extractSectionInstances(
  content: Record<string, unknown> | null | undefined,
): SectionInstancesMap {
  if (!content) return {};
  const raw = content[SECTION_INSTANCES_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: SectionInstancesMap = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const tk = (val as Record<string, unknown>).templateKey;
      const lbl = (val as Record<string, unknown>).label;
      if (typeof tk === 'string') {
        out[key] = { templateKey: tk, ...(typeof lbl === 'string' ? { label: lbl } : {}) };
      }
    }
  }
  return out;
}

export function extractDeletedSections(content: Record<string, unknown> | null | undefined): string[] {
  if (!content) return [];
  const raw = content[DELETED_SECTIONS_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === 'string');
}

/**
 * Resolve the final ordered list of sections to render for a converted page.
 * Inputs:
 *   - `registrySections`: keys+labels from the page's editor-registry.ts
 *   - `content`: merged convertedContent (defaultContent ⊕ override)
 * Output: `{ key, templateKey }[]` — `key` is the data slot in `content`
 *   to read; `templateKey` is the registry key whose Component renders it.
 *
 * Shape rules:
 *   1. Soft-deleted keys (`__deletedSections`) are filtered out.
 *   2. Duplicate instances (`__sectionInstances`) are inserted right after
 *      their template (when no explicit order is set).
 *   3. `__sectionOrder` overrides everything when present; missing keys are
 *      appended at the end so newly-added registry sections still render.
 */
export type ResolvedSectionEntry = { key: string; templateKey: string };

export function resolveRenderSections<T extends { key: string }>(
  registrySections: ReadonlyArray<T>,
  content: Record<string, unknown> | null | undefined,
): ResolvedSectionEntry[] {
  const order = extractSectionOrder(content);
  const instances = extractSectionInstances(content);
  const deleted = new Set(extractDeletedSections(content));
  const registryKeys = registrySections.map((s) => s.key);

  let orderedKeys: string[];
  if (order && order.length > 0) {
    const seen = new Set(order);
    const tail = [...registryKeys, ...Object.keys(instances)].filter((k) => !seen.has(k));
    orderedKeys = [...order, ...tail];
  } else {
    const instancesByTemplate = new Map<string, string[]>();
    for (const [k, meta] of Object.entries(instances)) {
      const list = instancesByTemplate.get(meta.templateKey) ?? [];
      list.push(k);
      instancesByTemplate.set(meta.templateKey, list);
    }
    orderedKeys = [];
    for (const k of registryKeys) {
      orderedKeys.push(k);
      const dups = instancesByTemplate.get(k);
      if (dups) orderedKeys.push(...dups);
    }
  }

  const registrySet = new Set(registryKeys);
  const result: ResolvedSectionEntry[] = [];
  for (const key of orderedKeys) {
    if (deleted.has(key)) continue;
    if (instances[key]) {
      // Duplicate instance — render via its template's Component.
      if (registrySet.has(instances[key].templateKey)) {
        result.push({ key, templateKey: instances[key].templateKey });
      }
      continue;
    }
    if (registrySet.has(key)) {
      result.push({ key, templateKey: key });
    }
    // Unknown keys are silently dropped (e.g. registry section removed).
  }
  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMediaObject(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  const allowedKeys = new Set([
    'id',
    // EditableImage shape (canonical for visual-editor uploads).
    'mediaId',
    'url',
    'src',
    'alt',
    'filename',
    'width',
    'height',
    'mimeType',
    'filesize',
  ]);
  return keys.every((key) => allowedKeys.has(key));
}

function isScalar(value: unknown): boolean {
  return ['string', 'number', 'boolean'].includes(typeof value) || value == null;
}

function canRepresentArray(value: unknown): value is unknown[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  if (value.every(isScalar)) return true;
  return value.every(
    (item) =>
      isPlainObject(item) &&
      Object.values(item).every(
        (subValue) =>
          isScalar(subValue) ||
          isMediaObject(subValue) ||
          (isPlainObject(subValue) && Object.values(subValue).every(isScalar)),
      ),
  );
}

function flattenObject(
  input: Record<string, unknown>,
  out: FlatRecord,
  jsonFields: string[],
  prefix = '',
) {
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      if (canRepresentArray(value)) {
        out[path] = value;
      } else {
        out[path] = JSON.stringify(value, null, 2);
        jsonFields.push(path);
      }
      continue;
    }
    if (isMediaObject(value)) {
      out[path] = value;
      continue;
    }
    if (isPlainObject(value)) {
      flattenObject(value, out, jsonFields, path);
      continue;
    }
    out[path] = value;
  }
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function prettifyLabel(key: string): string {
  return key
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fieldTypeForValue(value: unknown): 'text' | 'textarea' | 'checkbox' {
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'string' && value.length > 140) return 'textarea';
  return 'text';
}

// Static registry mapping the trailing segment of a field path to a builder
// for its editor field config. Adding a new specialized field type = one entry
// here. Unknown tails fall back to value-based type inference (fieldTypeForValue).
type FieldBuilder = (name: string, label: string) => EditorField;

const buildSelectField = (
  options: Array<{ label: string; value: string }>,
): FieldBuilder => (name, label) => ({ name, type: 'select', label, options });

const FIELD_BUILDERS_BY_TAIL: Record<string, FieldBuilder> = {
  // ── Image / media slots ──────────────────────────────────────────────────
  // Anything ending with one of these tail names gets rendered as an image
  // upload control in the inspector panel. Inline single-click on a
  // `data-image-field` element opens the same upload UI directly.
  image: (name, label) => ({ name, type: 'upload', label }),
  logoimage: (name, label) => ({ name, type: 'upload', label }),
  logo: (name, label) => ({ name, type: 'upload', label }),
  photo: (name, label) => ({ name, type: 'upload', label }),
  avatar: (name, label) => ({ name, type: 'upload', label }),
  bg: (name, label) => ({ name, type: 'upload', label }),
  background: (name, label) => ({ name, type: 'upload', label }),
  backgroundimage: (name, label) => ({ name, type: 'upload', label }),
  media: (name, label) => ({ name, type: 'upload', label }),
  mapimage: (name, label) => ({ name, type: 'upload', label }),
  thumbnail: (name, label) => ({ name, type: 'upload', label }),
  icon: (name, label) => ({ name, type: 'icon-upload', label }),
  // Section-type selector: picks which collection backs this card-shaped
  // section. Matches the Dastify brand book canonical section types
  // (blog-posts §08, services §06, case-studies §05). 'auto' uses convention
  // detection from the section key. 'static' falls back to hand-entered data
  // (brand book Rule 01 default). See src/lib/converted-pages/section-types.ts.
  sectiontype: buildSelectField([
    { label: 'Auto-detect from section key', value: 'auto' },
    { label: 'Blog Posts (collection)', value: 'blog-posts' },
    { label: 'Services (collection)', value: 'services' },
    { label: 'Case Studies (collection)', value: 'case-studies' },
    { label: 'Static (hand-entered below)', value: 'static' },
  ]),
  // `source` is a secondary filter mode within a collection-backed section.
  // Only relevant when sectionType is a collection (not 'static'/'auto').
  source: buildSelectField([
    { label: 'Latest', value: 'latest' },
    { label: 'By category slug', value: 'category' },
    { label: 'By tag slug', value: 'tag' },
  ]),
  imagefit: buildSelectField([
    { label: 'Cover', value: 'cover' },
    { label: 'Contain', value: 'contain' },
    { label: 'Fill', value: 'fill' },
    { label: 'None', value: 'none' },
    { label: 'Scale Down', value: 'scale-down' },
  ]),
  imageposition: buildSelectField([
    { label: 'Center', value: 'center' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'Top Left', value: 'top left' },
    { label: 'Top Right', value: 'top right' },
    { label: 'Bottom Left', value: 'bottom left' },
    { label: 'Bottom Right', value: 'bottom right' },
  ]),
  placeholderborderstyle: buildSelectField([
    { label: 'None', value: 'none' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
  ]),
  preserveplaceholderchrome: (name, label) => ({ name, type: 'checkbox', label }),
  placeholdershowoverlay: (name, label) => ({ name, type: 'checkbox', label }),
  embedhtml: (name, label) => ({ name, type: 'textarea', label }),
  embedurl: (name, label) => ({ name, type: 'textarea', label }),
  embedcode: (name, label) => ({ name, type: 'textarea', label }),
  iconsize: (name, label) => ({ name, type: 'number', label, min: 10, max: 200, step: 1 }),
  iconoffsetx: (name, label) => ({ name, type: 'number', label, min: -100, max: 100, step: 1 }),
  iconoffsety: (name, label) => ({ name, type: 'number', label, min: -100, max: 100, step: 1 }),
};

function fieldForName(name: string, value: unknown): EditorField {
  const tail = name.split('.').pop()?.toLowerCase() ?? '';
  const label = prettifyLabel(name);

  const builder = FIELD_BUILDERS_BY_TAIL[tail];
  if (builder) return builder(name, label);

  return { name, type: fieldTypeForValue(value), label };
}

function subFieldForName(
  name: string,
  value: unknown,
): Exclude<EditorField, { type: 'array' }> {
  const field = fieldForName(name, value);
  if (field.type === 'array') {
    return {
      name,
      type: 'text',
      label: prettifyLabel(name),
    };
  }
  return field;
}

function buildSectionForKey(
  pageName: string,
  content: Record<string, unknown>,
  sectionKey: string,
  spec: ConvertedSectionSpec,
  templateKey: string,
): SectionInstance {
  // Section data is stored under `sectionKey` (which equals the template key
  // for original registry sections, or the synthetic instance key for
  // duplicates). The block type is keyed off the *template* so the editor
  // looks up the same field-config as the original.
  const sectionData = (content[sectionKey] ?? {}) as Record<string, unknown>;
  const { [PERSISTED_HIDDEN_KEY]: hiddenFlag, ...sectionDataForFlatten } = sectionData;
  const flat: FlatRecord = {};
  const jsonFields: string[] = [];
  flattenObject(sectionDataForFlatten, flat, jsonFields);
  flat[META_JSON_FIELDS] = jsonFields;
  flat[META_SECTION_KEY] = sectionKey;
  flat[META_SECTION_LABEL] = spec.label;
  flat[META_SECTION_ICON] = spec.icon ?? '🧩';
  if (templateKey !== sectionKey) flat[META_TEMPLATE_KEY] = templateKey;
  if (hiddenFlag === true) flat[META_SECTION_HIDDEN] = true;

  return {
    id: `cp-section-${sectionKey}`,
    label: spec.label,
    columns: [
      {
        id: `cp-col-${sectionKey}`,
        width: '1/1',
        blocks: [
          {
            id: `cp-block-${sectionKey}`,
            blockType: `cp-${pageName}-${templateKey}`,
            data: flat,
          },
        ],
      },
    ],
  };
}

export function convertedPageContentToSections(
  pageName: string,
  content: Record<string, unknown>,
  specs: ConvertedSectionSpec[],
): SectionInstance[] {
  const order = extractSectionOrder(content);
  const instances = extractSectionInstances(content);
  const deleted = new Set(extractDeletedSections(content));
  const specByKey = new Map(specs.map((s) => [s.key, s]));

  // Build the union of all known section keys: registry keys + instance keys.
  // Then resolve final order: explicit `__sectionOrder` wins; otherwise the
  // registry order with instances appended after their template key.
  const registryKeys = specs.map((s) => s.key);
  const instanceKeys = Object.keys(instances);

  let orderedKeys: string[];
  if (order && order.length > 0) {
    // Keep order entries that we can resolve, then append any keys missing
    // from the order so newly-added registry sections still render.
    const seen = new Set(order);
    const tail = [...registryKeys, ...instanceKeys].filter((k) => !seen.has(k));
    orderedKeys = [...order, ...tail];
  } else {
    // Default: registry order, with each duplicate appended right after its
    // template so a fresh duplicate appears next to its original.
    orderedKeys = [];
    const instancesByTemplate = new Map<string, string[]>();
    for (const [k, meta] of Object.entries(instances)) {
      const list = instancesByTemplate.get(meta.templateKey) ?? [];
      list.push(k);
      instancesByTemplate.set(meta.templateKey, list);
    }
    for (const k of registryKeys) {
      orderedKeys.push(k);
      const dups = instancesByTemplate.get(k);
      if (dups) orderedKeys.push(...dups);
    }
  }

  const result: SectionInstance[] = [];
  for (const key of orderedKeys) {
    if (deleted.has(key)) continue;
    const instance = instances[key];
    const templateKey = instance ? instance.templateKey : key;
    const baseSpec = specByKey.get(templateKey);
    if (!baseSpec) continue; // unknown template — skip
    const spec: ConvertedSectionSpec = instance
      ? { ...baseSpec, key, label: instance.label ?? `${baseSpec.label} (copy)` }
      : baseSpec;
    result.push(buildSectionForKey(pageName, content, key, spec, templateKey));
  }
  return result;
}

export type ConvertedSectionsMeta = {
  /** Final desktop section order — superset of registry keys and instance keys. */
  sectionOrder?: string[];
  /** Map of synthetic instance key → template metadata. */
  sectionInstances?: SectionInstancesMap;
  /** Soft-deleted section keys; their data still lives in convertedContent. */
  deletedSections?: string[];
};

export function sectionsToConvertedPageContent(
  baseContent: Record<string, unknown>,
  sections: SectionInstance[],
  meta?: ConvertedSectionsMeta,
): Record<string, unknown> {
  const next = structuredClone(baseContent);

  for (const section of sections) {
    for (const col of section.columns) {
      for (const block of col.blocks) {
        if (!block.blockType.startsWith('cp-')) continue;
        const data = block.data as FlatRecord;
        const sectionKey = String(data[META_SECTION_KEY] ?? '');
        if (!sectionKey) continue;
        const jsonFields = Array.isArray(data[META_JSON_FIELDS])
          ? (data[META_JSON_FIELDS] as string[])
          : [];
        const rebuilt: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith(META_PREFIX)) continue;
          const nextValue = jsonFields.includes(key) ? parseMaybeJson(value) : value;
          setValueAtPath(rebuilt, key, nextValue);
        }

        // Promote the editor-only `__sectionHidden` meta flag back onto the
        // persisted section object as `__hidden`, where the public renderer
        // and merge function can see it. Omit when not hidden so we don't
        // clutter saved content.
        if (data[META_SECTION_HIDDEN] === true) {
          rebuilt[PERSISTED_HIDDEN_KEY] = true;
        }

        next[sectionKey] = rebuilt;
      }
    }
  }

  // Round-trip the order / duplicate / soft-delete meta. Each is omitted
  // entirely when empty so we don't clutter saved content with empty arrays.
  if (meta?.sectionOrder && meta.sectionOrder.length > 0) {
    next[SECTION_ORDER_KEY] = [...meta.sectionOrder];
  } else {
    delete next[SECTION_ORDER_KEY];
  }
  if (meta?.sectionInstances && Object.keys(meta.sectionInstances).length > 0) {
    next[SECTION_INSTANCES_KEY] = structuredClone(meta.sectionInstances);
  } else {
    delete next[SECTION_INSTANCES_KEY];
  }
  if (meta?.deletedSections && meta.deletedSections.length > 0) {
    next[DELETED_SECTIONS_KEY] = [...meta.deletedSections];
  } else {
    delete next[DELETED_SECTIONS_KEY];
  }

  return next;
}

export function buildConvertedBlockDefinition(
  blockType: string,
  label: string,
  icon: string,
  data: FlatRecord,
): BlockDefinition {
  const fields: BlockDefinition['fields'] = [];
  const jsonFieldSet = new Set(
    Array.isArray(data[META_JSON_FIELDS]) ? (data[META_JSON_FIELDS] as string[]) : [],
  );

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith(META_PREFIX)) continue;

    if (Array.isArray(value)) {
      const sample = value.find((item) => item != null);
      if (isPlainObject(sample)) {
        fields.push({
          name: key,
          type: 'array',
          label: prettifyLabel(key),
          subFields: Object.keys(sample).map((sampleKey) => subFieldForName(sampleKey, sample[sampleKey])),
        });
      } else {
        fields.push({
          name: key,
          type: 'array',
          label: prettifyLabel(key),
          subFields: [{ name: 'value', type: 'text', label: 'Value' }],
        });
      }
      continue;
    }

    if (jsonFieldSet.has(key)) {
      fields.push({
        name: key,
        type: 'textarea',
        label: `${prettifyLabel(key)} (JSON)`,
      });
      continue;
    }

    if (key.startsWith('editor.')) {
      continue;
    }

    fields.push(fieldForName(key, value));
  }

  return {
    blockType,
    label,
    icon,
    category: 'Content',
    defaultData: structuredClone(data),
    fields,
  };
}
