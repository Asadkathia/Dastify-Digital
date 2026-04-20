import { describe, it, expect } from 'vitest';
import { normalizeSlug, asPathnameFromSegments, trimSlashes } from './slug';

describe('normalizeSlug', () => {
  it('lowercases and trims whitespace', () => {
    expect(normalizeSlug('  Hello World  ')).toBe('hello-world');
  });

  it('strips non-url-safe characters', () => {
    expect(normalizeSlug("It's a test!")).toBe('its-a-test');
  });

  it('collapses multiple spaces to single hyphens', () => {
    expect(normalizeSlug('foo   bar')).toBe('foo-bar');
  });

  it('collapses multiple slashes', () => {
    expect(normalizeSlug('foo//bar')).toBe('foo/bar');
  });

  it('strips leading and trailing hyphens', () => {
    expect(normalizeSlug('---foo---')).toBe('foo');
  });

  it('preserves allowed existing hyphens', () => {
    expect(normalizeSlug('already-kebab-case')).toBe('already-kebab-case');
  });
});

describe('asPathnameFromSegments', () => {
  it('returns "/" for undefined', () => {
    expect(asPathnameFromSegments(undefined)).toBe('/');
  });

  it('returns "/" for empty array', () => {
    expect(asPathnameFromSegments([])).toBe('/');
  });

  it('joins segments with a single slash', () => {
    expect(asPathnameFromSegments(['a', 'b', 'c'])).toBe('/a/b/c');
  });

  it('trims each segment and drops empties', () => {
    expect(asPathnameFromSegments([' a ', '', 'b ', '  '])).toBe('/a/b');
  });
});

describe('trimSlashes', () => {
  it('removes leading and trailing slashes', () => {
    expect(trimSlashes('/foo/bar/')).toBe('foo/bar');
  });

  it('is a no-op when no slashes at edges', () => {
    expect(trimSlashes('foo/bar')).toBe('foo/bar');
  });

  it('collapses multiple edge slashes', () => {
    expect(trimSlashes('///foo///')).toBe('foo');
  });

  it('returns empty string for all-slash input', () => {
    expect(trimSlashes('///')).toBe('');
  });
});
