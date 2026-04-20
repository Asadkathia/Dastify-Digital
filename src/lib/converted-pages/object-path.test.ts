import { describe, it, expect } from 'vitest';
import { getValueAtPath, setValueAtPath, sanitizeNodeKey } from './object-path';

describe('getValueAtPath', () => {
  it('returns source for empty path', () => {
    expect(getValueAtPath({ a: 1 }, '')).toEqual({ a: 1 });
  });

  it('reads simple flat key', () => {
    expect(getValueAtPath({ a: 1 }, 'a')).toBe(1);
  });

  it('reads nested dotted path', () => {
    expect(getValueAtPath({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
  });

  it('reads into array by numeric segment', () => {
    expect(getValueAtPath({ items: [{ label: 'x' }, { label: 'y' }] }, 'items.1.label')).toBe('y');
  });

  it('returns undefined for missing key', () => {
    expect(getValueAtPath({ a: 1 }, 'b')).toBeUndefined();
  });

  it('returns undefined when traversing through null', () => {
    expect(getValueAtPath({ a: null }, 'a.b')).toBeUndefined();
  });

  it('returns undefined when traversing through a primitive', () => {
    expect(getValueAtPath({ a: 1 }, 'a.b')).toBeUndefined();
  });
});

describe('setValueAtPath', () => {
  it('sets a simple flat key', () => {
    const obj: Record<string, unknown> = {};
    setValueAtPath(obj, 'a', 1);
    expect(obj).toEqual({ a: 1 });
  });

  it('creates intermediate objects for nested path', () => {
    const obj: Record<string, unknown> = {};
    setValueAtPath(obj, 'a.b.c', 42);
    expect(obj).toEqual({ a: { b: { c: 42 } } });
  });

  it('creates intermediate arrays when next segment is an index', () => {
    const obj: Record<string, unknown> = {};
    setValueAtPath(obj, 'items.0.label', 'x');
    expect(obj).toEqual({ items: [{ label: 'x' }] });
  });

  it('overwrites existing leaf values', () => {
    const obj: Record<string, unknown> = { a: { b: 1 } };
    setValueAtPath(obj, 'a.b', 2);
    expect(obj).toEqual({ a: { b: 2 } });
  });

  it('replaces a primitive mid-path with a container object', () => {
    // A string at "a" gets replaced by an object because the path continues.
    const obj: Record<string, unknown> = { a: 'primitive' };
    setValueAtPath(obj, 'a.b', 5);
    expect(obj).toEqual({ a: { b: 5 } });
  });
});

describe('sanitizeNodeKey', () => {
  it('replaces non-alphanumeric runs with single underscore', () => {
    expect(sanitizeNodeKey('foo.bar.baz')).toBe('foo_bar_baz');
  });

  it('trims leading and trailing underscores', () => {
    expect(sanitizeNodeKey('.foo.')).toBe('foo');
  });

  it('returns "node" for empty / punctuation-only input', () => {
    expect(sanitizeNodeKey('')).toBe('node');
    expect(sanitizeNodeKey('...')).toBe('node');
  });
});
