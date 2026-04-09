const RESERVED_SLUGS = new Set([
  '',
  'admin',
  'api',
  'services',
  'blog',
  'case-studies',
  'media',
  'page-editor-preview',
]);

export function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function isReservedPageSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(normalizeSlug(slug));
}

export function reservedSlugsList(): string[] {
  return [...RESERVED_SLUGS].filter(Boolean).sort();
}

export function suggestImportSlug(slug: string): string {
  const base = normalizeSlug(slug) || 'import-page';
  let candidate = `${base}-import`;
  if (!isReservedPageSlug(candidate)) return candidate;

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  candidate = `${base}-import-${stamp}`;
  if (!isReservedPageSlug(candidate)) return candidate;

  return `${base}-import-${Date.now()}`;
}
