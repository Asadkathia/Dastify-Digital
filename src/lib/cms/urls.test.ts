import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getSiteURL, absoluteURL, canonicalFromPath, buildCollectionPath } from './urls';

describe('getSiteURL', () => {
  const ORIGINAL = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SERVER_URL: process.env.SERVER_URL,
  };

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL.NEXT_PUBLIC_SITE_URL;
    process.env.SERVER_URL = ORIGINAL.SERVER_URL;
  });

  it('prefers NEXT_PUBLIC_SITE_URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    process.env.SERVER_URL = 'https://other.com';
    expect(getSiteURL()).toBe('https://example.com');
  });

  it('falls back to SERVER_URL', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.SERVER_URL = 'https://fallback.com';
    expect(getSiteURL()).toBe('https://fallback.com');
  });

  it('defaults to localhost', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SERVER_URL;
    expect(getSiteURL()).toBe('http://localhost:3000');
  });

  it('strips trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/';
    expect(getSiteURL()).toBe('https://example.com');
  });
});

describe('absoluteURL', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
  });

  it('passes through a URL already absolute (http)', () => {
    expect(absoluteURL('http://other.com/x')).toBe('http://other.com/x');
  });

  it('passes through a URL already absolute (https)', () => {
    expect(absoluteURL('https://other.com/x')).toBe('https://other.com/x');
  });

  it('adds leading slash when missing', () => {
    expect(absoluteURL('foo')).toBe('https://example.com/foo');
  });

  it('keeps existing leading slash', () => {
    expect(absoluteURL('/foo')).toBe('https://example.com/foo');
  });
});

describe('canonicalFromPath', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
  });

  it('normalizes to no trailing slash', () => {
    expect(canonicalFromPath('/about/')).toBe('https://example.com/about');
  });

  it('returns root for empty path', () => {
    expect(canonicalFromPath('/')).toBe('https://example.com/');
  });

  it('handles multiple leading slashes', () => {
    expect(canonicalFromPath('///foo')).toBe('https://example.com/foo');
  });
});

describe('buildCollectionPath', () => {
  it('joins prefix and slug with a single slash', () => {
    expect(buildCollectionPath('blog', 'hello-world')).toBe('/blog/hello-world');
  });

  it('trims extra slashes', () => {
    expect(buildCollectionPath('/blog/', '/hello-world/')).toBe('/blog/hello-world');
  });
});
