import type { BlockDefinition, EditorField, SectionInstance } from '@/payload/views/PageEditor/types';
import type { ConvertedSectionSpec } from './types';
import { setValueAtPath } from './object-path';

type FlatRecord = Record<string, unknown>;

const META_PREFIX = '__';
const META_JSON_FIELDS = '__jsonFields';
const META_SECTION_KEY = '__sectionKey';
const META_SECTION_LABEL = '__sectionLabel';
const META_SECTION_ICON = '__sectionIcon';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMediaObject(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  const allowedKeys = new Set([
    'id',
    'url',
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
  image: (name, label) => ({ name, type: 'upload', label }),
  logoimage: (name, label) => ({ name, type: 'upload', label }),
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

export function convertedPageContentToSections(
  pageName: string,
  content: Record<string, unknown>,
  specs: ConvertedSectionSpec[],
): SectionInstance[] {
  return specs.map((spec) => {
    const sectionData = (content[spec.key] ?? {}) as Record<string, unknown>;
    const flat: FlatRecord = {};
    const jsonFields: string[] = [];
    flattenObject(sectionData, flat, jsonFields);
    flat[META_JSON_FIELDS] = jsonFields;
    flat[META_SECTION_KEY] = spec.key;
    flat[META_SECTION_LABEL] = spec.label;
    flat[META_SECTION_ICON] = spec.icon ?? '🧩';

    return {
      id: `cp-section-${spec.key}`,
      label: spec.label,
      columns: [
        {
          id: `cp-col-${spec.key}`,
          width: '1/1',
          blocks: [
            {
              id: `cp-block-${spec.key}`,
              blockType: `cp-${pageName}-${spec.key}`,
              data: flat,
            },
          ],
        },
      ],
    };
  });
}

export function sectionsToConvertedPageContent(
  baseContent: Record<string, unknown>,
  sections: SectionInstance[],
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

        next[sectionKey] = rebuilt;
      }
    }
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
