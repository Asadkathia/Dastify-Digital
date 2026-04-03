import { trimSlashes } from './slug.ts';

export function getSiteURL(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.SERVER_URL || 'http://localhost:3000';
  return value.replace(/\/$/, '');
}

export function absoluteURL(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteURL()}${normalized}`;
}

export function canonicalFromPath(pathname: string): string {
  return absoluteURL(`/${trimSlashes(pathname)}`.replace(/\/$/, '') || '/');
}

export function buildCollectionPath(prefix: string, slug: string): string {
  return `/${trimSlashes(prefix)}/${trimSlashes(slug)}`;
}
