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

describe('mergeConvertedContent — legacy-shape migration', () => {
  it('lifts contact main.{form,info} to top-level', () => {
    const fallback = {
      hero: { title: 'Contact' },
      form: { title: 'Default form' },
      info: { contact: { title: 'Default info' } },
    };
    const override = {
      hero: { title: 'Saved hero' },
      main: {
        form: { title: 'Saved form' },
        info: { contact: { title: 'Saved info' } },
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'contact') as {
      form: { title: string };
      info: { contact: { title: string } };
      main?: unknown;
    };
    expect(merged.form.title).toBe('Saved form');
    expect(merged.info.contact.title).toBe('Saved info');
    expect(merged.main).toBeUndefined();
  });

  it('lifts book-session main.{scheduler,form,sidebar} to top-level', () => {
    const fallback = {
      scheduler: { title: 'Default sched' },
      form: { title: 'Default form' },
      sidebar: { title: 'Default sidebar' },
    };
    const override = {
      main: {
        scheduler: { title: 'Saved sched' },
        form: { title: 'Saved form' },
        sidebar: { title: 'Saved sidebar' },
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'book-session') as {
      scheduler: { title: string };
      form: { title: string };
      sidebar: { title: string };
      main?: unknown;
    };
    expect(merged.scheduler.title).toBe('Saved sched');
    expect(merged.form.title).toBe('Saved form');
    expect(merged.sidebar.title).toBe('Saved sidebar');
    expect(merged.main).toBeUndefined();
  });

  it('does not lift blog-1 main (no refactor — main stays as section key)', () => {
    const fallback = { main: { posts: [], categories: [] } };
    const override = {
      main: {
        posts: [{ title: 'Saved post' }],
        categories: ['SEO'],
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'blog-1') as {
      main: { posts: Array<{ title: string }>; categories: string[] };
      posts?: unknown;
    };
    expect(merged.main.posts).toHaveLength(1);
    expect(merged.main.posts[0].title).toBe('Saved post');
    expect(merged.posts).toBeUndefined();
  });

  it('preserves non-lifted keys under main wrapper (e.g. meta)', () => {
    const fallback = { hero: { title: 'C' }, form: { title: 'F' }, info: {}, main: { meta: { x: 1 } } };
    const override = {
      main: {
        form: { title: 'Saved form' },
        meta: { x: 42 },
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'contact') as {
      form: { title: string };
      main: { meta: { x: number } };
    };
    expect(merged.form.title).toBe('Saved form');
    expect(merged.main.meta.x).toBe(42);
  });

  it('does not overwrite already-new-shape top-level keys (idempotency)', () => {
    const fallback = { form: { title: 'F' }, info: { contact: { title: 'I' } } };
    const override = {
      form: { title: 'New form' },
      main: { form: { title: 'Old form' } }, // legacy override; should be ignored
    };
    const merged = mergeConvertedContent(fallback, override, 'contact') as {
      form: { title: string };
      main?: unknown;
    };
    expect(merged.form.title).toBe('New form');
    expect(merged.main).toBeUndefined();
  });

  it('is a no-op when pageName is not provided', () => {
    const fallback = { form: {} };
    const override = { main: { form: { title: 'X' } } };
    const merged = mergeConvertedContent(fallback, override) as {
      form: { title?: string };
      main: { form: { title: string } };
    };
    // No migration → main is preserved; form stays empty.
    expect(merged.main.form.title).toBe('X');
    expect((merged.form as { title?: string }).title).toBeUndefined();
  });

  it('merges services-convert specialties.tabContent[slug] into tabs[i] by slug', () => {
    const fallback = {
      specialties: {
        tabs: [
          { slug: 'cosmetic', label: 'Cosmetic', headline: 'Default H', description: 'Default D', bullets: [] },
          { slug: 'dental', label: 'Dental', headline: 'Default H', description: 'Default D', bullets: [] },
        ],
      },
    };
    const override = {
      specialties: {
        tabs: [
          { slug: 'cosmetic', label: 'Cosmetic' },
          { slug: 'dental', label: 'Dental' },
        ],
        tabContent: {
          cosmetic: { headline: 'Saved cosmetic H', description: 'Saved cosmetic D', bullets: ['a', 'b'] },
          dental: { headline: 'Saved dental H', description: 'Saved dental D', bullets: ['c'] },
        },
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'services-convert') as {
      specialties: {
        tabs: Array<{ slug: string; headline: string; description: string; bullets: string[] }>;
        tabContent?: unknown;
      };
    };
    expect(merged.specialties.tabContent).toBeUndefined();
    expect(merged.specialties.tabs[0].headline).toBe('Saved cosmetic H');
    expect(merged.specialties.tabs[0].bullets).toEqual(['a', 'b']);
    expect(merged.specialties.tabs[1].headline).toBe('Saved dental H');
  });

  it('services-convert: leaves new-shape tabs alone when tabContent is absent', () => {
    const fallback = {
      specialties: {
        tabs: [{ slug: 'a', headline: 'D', description: 'D', bullets: [] }],
      },
    };
    const override = {
      specialties: {
        tabs: [{ slug: 'a', headline: 'Saved', description: 'Saved', bullets: ['x'] }],
      },
    };
    const merged = mergeConvertedContent(fallback, override, 'services-convert') as {
      specialties: { tabs: Array<{ headline: string; bullets: string[] }> };
    };
    expect(merged.specialties.tabs[0].headline).toBe('Saved');
    expect(merged.specialties.tabs[0].bullets).toEqual(['x']);
  });
});
