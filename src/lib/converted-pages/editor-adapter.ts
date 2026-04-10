import type { BlockDefinition, EditorField, SectionInstance } from '@/payload/views/PageEditor/types';
import type { ConvertedSectionSpec } from './types';

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
      Object.values(item).every((subValue) => isScalar(subValue) || isMediaObject(subValue)),
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

function setByPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.');
  let cursor: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]!;
    const next = cursor[part];
    if (!isPlainObject(next)) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]!] = value;
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

function isUploadFieldName(name: string): boolean {
  const tail = name.split('.').pop()?.toLowerCase() ?? '';
  return tail === 'image';
}

function buildSelectField(
  name: string,
  label: string,
  options: Array<{ label: string; value: string }>,
): EditorField {
  return {
    name,
    type: 'select',
    label,
    options,
  };
}

function fieldForName(name: string, value: unknown): EditorField {
  const tail = name.split('.').pop()?.toLowerCase() ?? '';
  const label = prettifyLabel(name);

  if (isUploadFieldName(name)) {
    return { name, type: 'upload', label };
  }

  if (tail === 'imagefit') {
    return buildSelectField(name, label, [
      { label: 'Cover', value: 'cover' },
      { label: 'Contain', value: 'contain' },
      { label: 'Fill', value: 'fill' },
      { label: 'None', value: 'none' },
      { label: 'Scale Down', value: 'scale-down' },
    ]);
  }

  if (tail === 'imageposition') {
    return buildSelectField(name, label, [
      { label: 'Center', value: 'center' },
      { label: 'Top', value: 'top' },
      { label: 'Bottom', value: 'bottom' },
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
      { label: 'Top Left', value: 'top left' },
      { label: 'Top Right', value: 'top right' },
      { label: 'Bottom Left', value: 'bottom left' },
      { label: 'Bottom Right', value: 'bottom right' },
    ]);
  }

  if (tail === 'placeholderborderstyle') {
    return buildSelectField(name, label, [
      { label: 'None', value: 'none' },
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
      { label: 'Double', value: 'double' },
    ]);
  }

  if (tail === 'preserveplaceholderchrome' || tail === 'placeholdershowoverlay') {
    return {
      name,
      type: 'checkbox',
      label,
    };
  }

  return {
    name,
    type: fieldTypeForValue(value),
    label,
  };
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
          setByPath(rebuilt, key, nextValue);
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
