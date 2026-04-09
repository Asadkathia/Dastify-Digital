import type { BlockDefinition, SectionInstance } from '@/payload/views/PageEditor/types';
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

function isScalar(value: unknown): boolean {
  return ['string', 'number', 'boolean'].includes(typeof value) || value == null;
}

function canRepresentArray(value: unknown): value is unknown[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  if (value.every(isScalar)) return true;
  return value.every((item) => isPlainObject(item) && Object.values(item).every(isScalar));
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
          subFields: Object.keys(sample).map((sampleKey) => ({
            name: sampleKey,
            type: 'text',
            label: prettifyLabel(sampleKey),
          })),
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

    fields.push({
      name: key,
      type: fieldTypeForValue(value),
      label: prettifyLabel(key),
    });
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
