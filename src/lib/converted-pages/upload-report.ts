/**
 * Upload report analyzer for converted-page uploads.
 *
 * Pure helper — no React, no DOM, no I/O. Builds a structured report from a
 * just-uploaded converted page so the admin UI can show the user what was
 * created/updated, what content surfaces it has, and what warnings (if any)
 * the user should address before publishing.
 */

import {
  resolveRenderSections,
  extractSectionInstances,
  extractDeletedSections,
  SECTION_ORDER_KEY,
  SECTION_INSTANCES_KEY,
  DELETED_SECTIONS_KEY,
} from './editor-adapter';
import { validateConvertedPagePublish, type ValidationIssue } from './validate-publish';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ReportSection = {
  key: string;
  templateKey?: string;
  label: string;
  fieldCount: number;
  imageCount: number;
  ctaCount: number;
  hidden?: boolean;
  isDuplicate?: boolean;
};

export type ImageFieldInfo = {
  path: string;
  url?: string;
  alt?: string;
  missingAlt?: boolean;
  isExternal?: boolean;
};

export type CtaFieldInfo = {
  path: string;
  label?: string;
  href?: string;
};

export type FormFieldInfo = {
  sectionKey: string;
  formId?: string | number;
};

export type UploadReportWarning = {
  code: string;
  severity: 'warn' | 'block';
  message: string;
  path?: string;
  sectionKey?: string;
};

export type NextActionKind =
  | 'open_visual_editor'
  | 'open_payload_page'
  | 'open_public_page'
  | 'rerun_upload';

export type NextAction = {
  kind: NextActionKind;
  label: string;
  href: string;
};

export type UploadReport = {
  action: 'created' | 'updated';
  pageId: string;
  slug: string;
  convertedPageName: string | null;
  title: string;

  sectionCount: number;
  sections: ReportSection[];
  deletedSections: string[];
  duplicateSections: string[];

  editableFieldCount: number;
  imageFields: ImageFieldInfo[];
  imagesMissingAlt: ImageFieldInfo[];
  ctaFields: CtaFieldInfo[];

  forms: FormFieldInfo[];

  warnings: UploadReportWarning[];

  nextActions: NextAction[];

  hasCustomHtmlFallback: boolean;
  isRegisteredConverted: boolean;
};

// ─── Internal helpers ────────────────────────────────────────────────────────

const MEDIA_OBJECT_KEYS = new Set([
  'id',
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

const IMAGE_NAME_PATTERN =
  /^(image|logo|photo|avatar|bg|background|backgroundImage|mapImage|thumbnail)$/i;

const CTA_PATH_TAIL = /(^|\.)([a-z0-9_]*cta|cta)$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMediaObject(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  return keys.every((key) => MEDIA_OBJECT_KEYS.has(key));
}

function isReservedKey(key: string): boolean {
  if (key.startsWith('__')) return true;
  if (key === '_sectionOverrides') return true;
  if (key === 'editor') return true;
  return false;
}

const NON_SECTION_TOP_LEVEL_KEYS = new Set<string>([
  'meta',
  'seo',
  'heroVariant',
]);

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function pathTail(path: string): string {
  const idx = path.lastIndexOf('.');
  return idx === -1 ? path : path.slice(idx + 1);
}

type LeafCb = (visit: {
  path: string;
  value: unknown;
  parent: Record<string, unknown> | unknown[] | null;
  key: string | number | null;
}) => void;

type ObjectCb = (visit: { path: string; value: Record<string, unknown> }) => void;

function walk(root: unknown, onLeaf: LeafCb, onObject: ObjectCb): void {
  function recur(
    value: unknown,
    path: string,
    parent: Record<string, unknown> | unknown[] | null,
    key: string | number | null,
  ): void {
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        recur(item, path ? `${path}.${idx}` : String(idx), value, idx);
      });
      return;
    }
    if (isMediaObject(value)) {
      onLeaf({ path, value, parent, key });
      return;
    }
    if (isPlainObject(value)) {
      onObject({ path, value });
      for (const [k, v] of Object.entries(value)) {
        if (isReservedKey(k)) continue;
        recur(v, path ? `${path}.${k}` : k, value, k);
      }
      return;
    }
    onLeaf({ path, value, parent, key });
  }
  recur(root, '', null, null);
}

function getMediaUrl(media: Record<string, unknown>): string | undefined {
  const url = media['url'] ?? media['src'];
  return typeof url === 'string' ? url : undefined;
}

function getMediaAlt(media: Record<string, unknown>): string | undefined {
  const alt = media['alt'];
  return typeof alt === 'string' ? alt : undefined;
}

function isImageTail(name: string): boolean {
  return IMAGE_NAME_PATTERN.test(name);
}

function siblingAlt(
  parent: Record<string, unknown> | unknown[] | null,
  tail: string,
): string | undefined {
  if (!isPlainObject(parent)) return undefined;
  const named = parent[`${tail}Alt`];
  if (typeof named === 'string') return named;
  const generic = parent['alt'];
  if (typeof generic === 'string' && tail !== 'alt') return generic;
  return undefined;
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function originHost(baseUrl: string | undefined): string | undefined {
  if (!baseUrl) return undefined;
  try {
    return new URL(baseUrl).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function urlHost(url: string): string | undefined {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function looksLikeCta(value: Record<string, unknown>): boolean {
  return 'label' in value && ('href' in value || 'url' in value);
}

// Per-section walk helpers — count things scoped to one section's data.

function countSectionMetrics(sectionData: unknown): {
  fieldCount: number;
  imageCount: number;
  ctaCount: number;
} {
  let fieldCount = 0;
  let imageCount = 0;
  let ctaCount = 0;
  if (!isPlainObject(sectionData)) {
    return { fieldCount, imageCount, ctaCount };
  }

  walk(
    sectionData,
    (leaf) => {
      const { path, value } = leaf;
      // Leaves at empty path occur only when root itself is a leaf — for a
      // section object the root is always an object so leaves always have a
      // path. Still guard defensively.
      if (!path) return;
      fieldCount += 1;

      if (isMediaObject(value)) {
        imageCount += 1;
        return;
      }

      const tail = pathTail(path);
      if (isImageTail(tail) && nonEmptyString(value)) {
        imageCount += 1;
      }
    },
    (objVisit) => {
      const { path, value } = objVisit;
      if (!path) return; // root is the section object itself
      if (isMediaObject(value)) return;
      if (looksLikeCta(value)) {
        ctaCount += 1;
        return;
      }
      if (CTA_PATH_TAIL.test(path)) {
        ctaCount += 1;
      }
    },
  );

  return { fieldCount, imageCount, ctaCount };
}

// ─── Builder ─────────────────────────────────────────────────────────────────

export function buildUploadReport(input: {
  action: 'created' | 'updated';
  pageId: string;
  slug: string;
  title: string;
  convertedPageName: string | null;
  convertedContent: Record<string, unknown> | null;
  blocks: ReadonlyArray<{ blockType?: string }> | null;
  registrySections?: ReadonlyArray<{ key: string; label: string }>;
  formIds?: Record<string, string | number>;
  baseUrl?: string;
}): UploadReport {
  const {
    action,
    pageId,
    slug,
    title,
    convertedPageName,
    convertedContent,
    blocks,
    registrySections = [],
    formIds = {},
    baseUrl,
  } = input;

  const isRegisteredConverted =
    Boolean(convertedPageName) && registrySections.length > 0;

  const hasCustomHtmlFallback = Array.isArray(blocks)
    ? blocks.some((b) => b?.blockType === 'custom-html-block')
    : false;

  // ── Sections ──────────────────────────────────────────────────────────────
  const sections: ReportSection[] = [];
  const instances = extractSectionInstances(convertedContent);
  const deletedSections = extractDeletedSections(convertedContent);

  if (isRegisteredConverted && convertedContent) {
    const resolved = resolveRenderSections(registrySections, convertedContent);
    const labelByKey = new Map(registrySections.map((s) => [s.key, s.label]));

    for (const entry of resolved) {
      const sectionData = convertedContent[entry.key];
      const isDuplicate = entry.templateKey !== entry.key;
      const instanceMeta = instances[entry.key];
      const label =
        (isDuplicate && instanceMeta?.label) ||
        labelByKey.get(entry.templateKey) ||
        entry.key;
      const hidden =
        isPlainObject(sectionData) && sectionData['__hidden'] === true;

      const metrics = countSectionMetrics(sectionData);

      const reportSection: ReportSection = {
        key: entry.key,
        label,
        fieldCount: metrics.fieldCount,
        imageCount: metrics.imageCount,
        ctaCount: metrics.ctaCount,
      };
      if (isDuplicate) {
        reportSection.templateKey = entry.templateKey;
        reportSection.isDuplicate = true;
      }
      if (hidden) reportSection.hidden = true;
      sections.push(reportSection);
    }
  }

  const duplicateSections = sections
    .filter((s) => s.isDuplicate)
    .map((s) => s.key);

  const sectionCount = sections.length;
  const editableFieldCount = sections.reduce((acc, s) => acc + s.fieldCount, 0);

  // ── Image / CTA walks across whole content ───────────────────────────────
  const imageFields: ImageFieldInfo[] = [];
  const ctaFields: CtaFieldInfo[] = [];
  const sameOriginHost = originHost(baseUrl);

  if (isPlainObject(convertedContent)) {
    walk(
      convertedContent,
      (leaf) => {
        const { path, value, parent } = leaf;
        if (!path) return;

        if (isMediaObject(value)) {
          const url = getMediaUrl(value);
          const alt = getMediaAlt(value);
          const info: ImageFieldInfo = { path };
          if (url) info.url = url;
          if (alt !== undefined) info.alt = alt;
          if (nonEmptyString(url) && !nonEmptyString(alt)) info.missingAlt = true;
          if (typeof url === 'string' && isExternalUrl(url)) info.isExternal = true;
          imageFields.push(info);
          return;
        }

        if (typeof value === 'string') {
          const tail = pathTail(path);
          if (isImageTail(tail) && nonEmptyString(value)) {
            const alt = siblingAlt(parent, tail);
            const info: ImageFieldInfo = { path, url: value };
            if (alt !== undefined) info.alt = alt;
            if (!nonEmptyString(alt)) info.missingAlt = true;
            if (isExternalUrl(value)) info.isExternal = true;
            imageFields.push(info);
          }
        }
      },
      (objVisit) => {
        const { path, value } = objVisit;
        if (!path) return;
        if (isMediaObject(value)) return;
        const isCtaShape = looksLikeCta(value);
        const isCtaPath = CTA_PATH_TAIL.test(path);
        if (!isCtaShape && !isCtaPath) return;

        const labelRaw = value['label'];
        const hrefRaw = value['href'] ?? value['url'];
        const cta: CtaFieldInfo = { path };
        if (typeof labelRaw === 'string') cta.label = labelRaw;
        if (typeof hrefRaw === 'string') cta.href = hrefRaw;
        ctaFields.push(cta);
      },
    );
  }

  const imagesMissingAlt = imageFields.filter((f) => f.missingAlt);

  // ── Forms ────────────────────────────────────────────────────────────────
  const formsMap = new Map<string, FormFieldInfo>();
  for (const [sectionKey, formId] of Object.entries(formIds)) {
    formsMap.set(sectionKey, { sectionKey, formId });
  }
  if (isPlainObject(convertedContent)) {
    for (const [sectionKey, sectionVal] of Object.entries(convertedContent)) {
      if (isReservedKey(sectionKey)) continue;
      if (sectionKey === SECTION_ORDER_KEY) continue;
      if (sectionKey === SECTION_INSTANCES_KEY) continue;
      if (sectionKey === DELETED_SECTIONS_KEY) continue;
      if (!isPlainObject(sectionVal)) continue;
      const fid = sectionVal['formId'];
      if (fid == null) continue;
      if (typeof fid !== 'string' && typeof fid !== 'number') continue;
      if (!formsMap.has(sectionKey)) {
        formsMap.set(sectionKey, { sectionKey, formId: fid });
      }
    }
  }
  const forms = Array.from(formsMap.values());

  // ── Warnings ─────────────────────────────────────────────────────────────
  const warnings: UploadReportWarning[] = [];

  if (!pageId) {
    warnings.push({
      severity: 'warn',
      code: 'missing_cms_page',
      message:
        'No CMS page id was returned for this upload. The page may not have been persisted correctly.',
    });
  }

  // unsupported_section — only when registry is non-empty
  if (registrySections.length > 0 && isPlainObject(convertedContent)) {
    const known = new Set(registrySections.map((s) => s.key));
    const instanceKeys = new Set(Object.keys(instances));
    for (const key of Object.keys(convertedContent)) {
      if (isReservedKey(key)) continue;
      if (key === SECTION_ORDER_KEY) continue;
      if (key === SECTION_INSTANCES_KEY) continue;
      if (key === DELETED_SECTIONS_KEY) continue;
      if (NON_SECTION_TOP_LEVEL_KEYS.has(key)) continue;
      if (known.has(key)) continue;
      if (instanceKeys.has(key)) continue; // duplicate instances are valid
      warnings.push({
        severity: 'warn',
        code: 'unsupported_section',
        message: `Section "${key}" is not in the registry and will not render.`,
        path: key,
        sectionKey: key,
      });
    }
  }

  // no_editable_fields
  if (
    isRegisteredConverted &&
    sectionCount > 0 &&
    editableFieldCount === 0
  ) {
    warnings.push({
      severity: 'warn',
      code: 'no_editable_fields',
      message:
        'This page has sections but no editable fields were detected. Marketing will not be able to edit copy inline.',
    });
  }

  // external_image_url — only when baseUrl provided
  if (sameOriginHost) {
    for (const img of imageFields) {
      if (!img.url || !img.isExternal) continue;
      const host = urlHost(img.url);
      if (!host || host === sameOriginHost) continue;
      warnings.push({
        severity: 'warn',
        code: 'external_image_url',
        message: `Image at ${img.path} loads from an external host (${host}). Consider re-hosting it on the site for reliability.`,
        path: img.path,
      });
    }
  }

  // missing_alt_text — one warning per image-with-missing-alt
  for (const img of imagesMissingAlt) {
    warnings.push({
      severity: 'warn',
      code: 'missing_alt_text',
      message: `Image at ${img.path} has no alt text. Add a description for screen readers.`,
      path: img.path,
    });
  }

  // conversion_fallback_html
  if (hasCustomHtmlFallback) {
    warnings.push({
      severity: 'warn',
      code: 'conversion_fallback_html',
      message:
        'The converter fell back to a raw HTML import. This page will not have inline-edit support until it is registered with an editor-registry.',
    });
  }

  // Merge validate-publish warnings + blocks. Block codes are promoted to
  // severity='warn' here so the upload report is purely informational; the
  // actual publish-time gate still enforces blocks.
  if (isPlainObject(convertedContent)) {
    const publishResult = validateConvertedPagePublish(convertedContent);
    const merged: ValidationIssue[] = [
      ...publishResult.warnings,
      ...publishResult.blocks,
    ];
    for (const issue of merged) {
      const isBlockCode = publishResult.blocks.includes(issue);
      const message = isBlockCode
        ? `${issue.message} (Publish will be blocked until this is fixed.)`
        : issue.message;
      const w: UploadReportWarning = {
        severity: 'warn',
        code: issue.code,
        message,
      };
      if (issue.path) w.path = issue.path;
      if (issue.sectionKey) w.sectionKey = issue.sectionKey;
      warnings.push(w);
    }
  }

  // ── Next actions ─────────────────────────────────────────────────────────
  const visualEditorHref = convertedPageName
    ? `/admin/edit-converted-page/${convertedPageName}`
    : `/admin/visual-editor/${pageId}`;
  const publicHref = slug === 'home' ? '/' : `/${slug}`;

  const nextActions: NextAction[] = [
    { kind: 'open_visual_editor', label: 'Open Visual Editor', href: visualEditorHref },
    { kind: 'open_payload_page', label: 'Open Payload Page', href: `/admin/collections/pages/${pageId}` },
    { kind: 'open_public_page', label: 'Open Public Page', href: publicHref },
    { kind: 'rerun_upload', label: 'Re-run Upload', href: '#' },
  ];

  return {
    action,
    pageId,
    slug,
    convertedPageName,
    title,

    sectionCount,
    sections,
    deletedSections,
    duplicateSections,

    editableFieldCount,
    imageFields,
    imagesMissingAlt,
    ctaFields,

    forms,

    warnings,

    nextActions,

    hasCustomHtmlFallback,
    isRegisteredConverted,
  };
}
