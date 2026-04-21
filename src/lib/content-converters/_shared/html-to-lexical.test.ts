import { describe, it, expect } from 'vitest';
import { htmlToLexical, plainTextToLexical, emptyLexical } from './html-to-lexical';

function firstChild(doc: ReturnType<typeof htmlToLexical>) {
  return doc.root.children[0];
}

describe('htmlToLexical', () => {
  it('produces a non-empty root document for plain text', () => {
    const doc = htmlToLexical('Hello world');
    expect(doc.root.type).toBe('root');
    expect(doc.root.children.length).toBeGreaterThan(0);
  });

  it('parses <p> into a paragraph node with the text', () => {
    const doc = htmlToLexical('<p>Hello world</p>');
    const first = firstChild(doc);
    expect(first.type).toBe('paragraph');
    if (first.type === 'paragraph') {
      expect(first.children).toHaveLength(1);
      expect(first.children[0].type).toBe('text');
      if (first.children[0].type === 'text') {
        expect(first.children[0].text).toBe('Hello world');
      }
    }
  });

  it('preserves heading levels h1–h6', () => {
    const doc = htmlToLexical('<h2>Heading 2</h2><h3>Heading 3</h3>');
    expect(doc.root.children).toHaveLength(2);
    expect(doc.root.children[0].type).toBe('heading');
    if (doc.root.children[0].type === 'heading') {
      expect(doc.root.children[0].tag).toBe('h2');
    }
    if (doc.root.children[1].type === 'heading') {
      expect(doc.root.children[1].tag).toBe('h3');
    }
  });

  it('parses <a href> as a link node with url + newTab', () => {
    const doc = htmlToLexical('<p>Visit <a href="https://x.com" target="_blank">here</a></p>');
    const para = firstChild(doc);
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    const link = para.children.find((n) => n.type === 'link');
    expect(link).toBeDefined();
    if (link && link.type === 'link') {
      expect(link.fields.url).toBe('https://x.com');
      expect(link.fields.newTab).toBe(true);
      expect(link.children[0].text).toBe('here');
    }
  });

  it('parses <strong> as bold format (bitmask 1)', () => {
    const doc = htmlToLexical('<p><strong>bold</strong> text</p>');
    const para = firstChild(doc);
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    const bold = para.children.find((n) => n.type === 'text' && n.text === 'bold');
    if (bold && bold.type === 'text') {
      expect(bold.format & 1).toBe(1);
    }
  });

  it('parses <em> as italic format (bitmask 2)', () => {
    const doc = htmlToLexical('<p><em>italic</em></p>');
    const para = firstChild(doc);
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    const em = para.children.find((n) => n.type === 'text' && n.text === 'italic');
    if (em && em.type === 'text') {
      expect(em.format & 2).toBe(2);
    }
  });

  it('combines formats when nested (strong + em = bold + italic)', () => {
    const doc = htmlToLexical('<p><strong><em>both</em></strong></p>');
    const para = firstChild(doc);
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    const node = para.children[0];
    if (node.type === 'text') {
      expect(node.format & 1).toBe(1);
      expect(node.format & 2).toBe(2);
    }
  });

  it('parses <ul><li> into a bullet list', () => {
    const doc = htmlToLexical('<ul><li>One</li><li>Two</li></ul>');
    const first = firstChild(doc);
    expect(first.type).toBe('list');
    if (first.type === 'list') {
      expect(first.listType).toBe('bullet');
      expect(first.children).toHaveLength(2);
      expect(first.children[0].value).toBe(1);
      expect(first.children[1].value).toBe(2);
    }
  });

  it('parses <ol><li> into a numbered list', () => {
    const doc = htmlToLexical('<ol><li>First</li><li>Second</li></ol>');
    const first = firstChild(doc);
    if (first.type === 'list') {
      expect(first.listType).toBe('number');
    }
  });

  it('decodes HTML entities', () => {
    const doc = htmlToLexical('<p>A &amp; B&nbsp;&mdash; &quot;quoted&quot;</p>');
    const para = firstChild(doc);
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    const text = para.children[0];
    if (text.type === 'text') {
      expect(text.text).toContain('A & B');
      expect(text.text).toContain('"quoted"');
      expect(text.text).toContain('—');
    }
  });

  it('ignores <script>, <style>, and <iframe>', () => {
    const doc = htmlToLexical('<p>Kept</p><script>alert(1)</script><style>body{}</style><p>Also kept</p>');
    const paragraphs = doc.root.children.filter((c) => c.type === 'paragraph');
    expect(paragraphs).toHaveLength(2);
  });

  it('unwraps <div> / <section> containers', () => {
    const doc = htmlToLexical('<div><section><p>Inside</p></section></div>');
    const first = firstChild(doc);
    expect(first.type).toBe('paragraph');
  });

  it('handles empty / whitespace-only input', () => {
    expect(htmlToLexical('').root.children.length).toBeGreaterThan(0);
    expect(htmlToLexical('   ').root.children.length).toBeGreaterThan(0);
  });
});

describe('plainTextToLexical', () => {
  it('splits on double newlines into separate paragraphs', () => {
    const doc = plainTextToLexical('First\n\nSecond\n\nThird');
    expect(doc.root.children).toHaveLength(3);
  });
});

describe('emptyLexical', () => {
  it('returns a valid root with an empty paragraph', () => {
    const doc = emptyLexical();
    expect(doc.root.children).toHaveLength(1);
    expect(doc.root.children[0].type).toBe('paragraph');
  });
});
