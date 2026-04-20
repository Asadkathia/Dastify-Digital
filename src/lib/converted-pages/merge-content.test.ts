import { describe, it, expect } from 'vitest';
import { mergeConvertedContent } from './merge-content';

describe('mergeConvertedContent', () => {
  it('returns a clone of fallback when override is null/undefined', () => {
    const fallback = { a: 1, b: 2 };
    const merged = mergeConvertedContent(fallback, null);
    expect(merged).toEqual(fallback);
    expect(merged).not.toBe(fallback); // clone, not reference
  });

  it('merges override keys over fallback keys', () => {
    const fallback = { a: 1, b: 2 };
    const override = { b: 99, c: 3 };
    expect(mergeConvertedContent(fallback, override)).toEqual({ a: 1, b: 99, c: 3 });
  });

  it('recursively merges nested objects', () => {
    const fallback = { nav: { logo: { text: 'Old', accent: '.Co' } } };
    const override = { nav: { logo: { text: 'New' } } };
    expect(mergeConvertedContent(fallback, override)).toEqual({
      nav: { logo: { text: 'New', accent: '.Co' } },
    });
  });

  it('replaces fallback with override when types mismatch', () => {
    const fallback = { foo: 'string' };
    const override = { foo: 42 };
    expect(mergeConvertedContent(fallback, override)).toEqual({ foo: 42 });
  });

  it('returns empty array when override is an empty array (full reset)', () => {
    const fallback = [1, 2, 3];
    expect(mergeConvertedContent(fallback, [])).toEqual([]);
  });

  it('merges arrays positionally', () => {
    const fallback = [{ a: 1 }, { a: 2 }];
    const override = [{ a: 10 }];
    // Length follows override; fallback[0] merged with override[0].
    expect(mergeConvertedContent(fallback, override)).toEqual([{ a: 10 }]);
  });

  it('extends array length to match override', () => {
    const fallback = [{ a: 1 }];
    const override = [{ a: 10 }, { a: 20 }];
    // Second item has no fallback counterpart — override wins outright.
    expect(mergeConvertedContent(fallback, override)).toEqual([{ a: 10 }, { a: 20 }]);
  });

  it('returns fallback when override is wrong type for an object', () => {
    const fallback = { nav: { title: 'home' } };
    const override = { nav: 'not-an-object' };
    // Override is not a plain object so nav falls back to fallback.
    expect(mergeConvertedContent(fallback, override)).toEqual({ nav: { title: 'home' } });
  });

  it('returns fallback array when override is not an array', () => {
    const fallback = { items: [1, 2] };
    const override = { items: 'not-an-array' };
    expect(mergeConvertedContent(fallback, override)).toEqual({ items: [1, 2] });
  });

  it('does not mutate fallback', () => {
    const fallback = { a: { b: 1 } };
    const original = JSON.parse(JSON.stringify(fallback));
    mergeConvertedContent(fallback, { a: { b: 2 } });
    expect(fallback).toEqual(original);
  });
});
