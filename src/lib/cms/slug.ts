export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '');
}

export function asPathnameFromSegments(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) {
    return '/';
  }

  return `/${segments.map((segment) => segment.trim()).filter(Boolean).join('/')}`;
}

export function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}
