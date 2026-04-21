/**
 * Convert an HTML string into a Lexical editor state (the JSON shape Payload's
 * richText field stores). Preserves headings (h1–h6), paragraphs, links,
 * lists (ul/ol/li), bold/italic/underline/code formatting, and inline <br>.
 *
 * Implementation note: we avoid a DOM dependency (jsdom is heavy + slow to
 * install). Instead we do a hand-rolled minimal HTML walker good enough for
 * blog-post body content. If a tag isn't recognized, children are emitted as
 * plain text — so unknown tags degrade to paragraphs rather than throwing.
 */

type LexicalText = {
  type: 'text';
  format: number; // bitmask: 1=bold, 2=italic, 8=underline, 16=code
  text: string;
  version: 1;
};

type LexicalLink = {
  type: 'link';
  format: '';
  indent: 0;
  version: 1;
  direction: 'ltr';
  fields: { url: string; newTab: boolean; linkType: 'custom' };
  children: LexicalText[];
};

type LexicalInline = LexicalText | LexicalLink;

type LexicalParagraph = {
  type: 'paragraph';
  format: '';
  indent: 0;
  version: 1;
  direction: 'ltr';
  children: LexicalInline[];
};

type LexicalHeading = {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  format: '';
  indent: 0;
  version: 1;
  direction: 'ltr';
  children: LexicalInline[];
};

type LexicalListItem = {
  type: 'listitem';
  format: '';
  indent: 0;
  version: 1;
  direction: 'ltr';
  value: number;
  children: LexicalInline[];
};

type LexicalList = {
  type: 'list';
  listType: 'bullet' | 'number';
  tag: 'ul' | 'ol';
  start: number;
  format: '';
  indent: 0;
  version: 1;
  direction: 'ltr';
  children: LexicalListItem[];
};

type LexicalBlock = LexicalParagraph | LexicalHeading | LexicalList;

export type LexicalRoot = {
  root: {
    type: 'root';
    format: '';
    indent: 0;
    version: 1;
    direction: 'ltr';
    children: LexicalBlock[];
  };
};

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_UNDERLINE = 8;
const FORMAT_CODE = 16;

// ─── Tokenizer ──────────────────────────────────────────────────────────────
// A permissive HTML tokenizer: yields text chunks, open tags, close tags.

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'open'; tag: string; attrs: Record<string, string>; selfClosing: boolean }
  | { kind: 'close'; tag: string };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      // Skip comments.
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i);
        i = end === -1 ? html.length : end + 3;
        continue;
      }
      // Skip doctype / processing instructions.
      if (html.startsWith('<!', i) || html.startsWith('<?', i)) {
        const end = html.indexOf('>', i);
        i = end === -1 ? html.length : end + 1;
        continue;
      }

      const end = html.indexOf('>', i);
      if (end === -1) {
        tokens.push({ kind: 'text', value: html.slice(i) });
        break;
      }
      const tagContent = html.slice(i + 1, end);
      if (tagContent.startsWith('/')) {
        const tag = tagContent.slice(1).trim().split(/\s/)[0].toLowerCase();
        tokens.push({ kind: 'close', tag });
      } else {
        const selfClosing = tagContent.endsWith('/');
        const body = selfClosing ? tagContent.slice(0, -1).trim() : tagContent.trim();
        const match = body.match(/^([a-zA-Z][\w-]*)\s*(.*)$/);
        if (match) {
          const tag = match[1].toLowerCase();
          const attrs = parseAttrs(match[2] ?? '');
          tokens.push({ kind: 'open', tag, attrs, selfClosing });
        }
      }
      i = end + 1;
    } else {
      const next = html.indexOf('<', i);
      const chunk = next === -1 ? html.slice(i) : html.slice(i, next);
      if (chunk) tokens.push({ kind: 'text', value: chunk });
      i = next === -1 ? html.length : next;
    }
  }
  return tokens;
}

function parseAttrs(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const key = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    out[key] = decodeEntities(value);
  }
  return out;
}

const SELF_CLOSING = new Set(['br', 'hr', 'img', 'meta', 'link', 'input']);
const IGNORE_TAGS = new Set(['script', 'style', 'noscript', 'svg', 'iframe', 'form']);
const INLINE_TAGS = new Set(['a', 'strong', 'b', 'em', 'i', 'u', 'code', 'br', 'span']);

// ─── Parser ──────────────────────────────────────────────────────────────────

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C');
}

function makeText(text: string, format: number): LexicalText {
  return { type: 'text', format, text, version: 1 };
}

function makeParagraph(children: LexicalInline[]): LexicalParagraph {
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', children };
}

function makeHeading(tag: LexicalHeading['tag'], children: LexicalInline[]): LexicalHeading {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children };
}

function makeListItem(children: LexicalInline[], value: number): LexicalListItem {
  return { type: 'listitem', format: '', indent: 0, version: 1, direction: 'ltr', value, children };
}

function makeList(kind: 'ul' | 'ol', items: LexicalListItem[]): LexicalList {
  return {
    type: 'list',
    listType: kind === 'ol' ? 'number' : 'bullet',
    tag: kind,
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items,
  };
}

/**
 * Parses inline content into Lexical inline nodes. Handles bold/italic/code/
 * underline/links/br and recursively merges formatting.
 */
function parseInline(tokens: Token[], endTag: string | null, start: number, formatStack: number[]): { nodes: LexicalInline[]; next: number } {
  const out: LexicalInline[] = [];
  let i = start;
  const currentFormat = formatStack.reduce((a, b) => a | b, 0);

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.kind === 'close' && endTag && t.tag === endTag) {
      return { nodes: out, next: i + 1 };
    }
    if (t.kind === 'text') {
      const text = decodeEntities(t.value);
      if (text) out.push(makeText(text, currentFormat));
      i++;
      continue;
    }
    if (t.kind === 'open') {
      const tag = t.tag;
      if (tag === 'br') {
        out.push(makeText('\n', currentFormat));
        i++;
        continue;
      }
      if (tag === 'strong' || tag === 'b') {
        const inner = parseInline(tokens, tag, i + 1, [...formatStack, FORMAT_BOLD]);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      if (tag === 'em' || tag === 'i') {
        const inner = parseInline(tokens, tag, i + 1, [...formatStack, FORMAT_ITALIC]);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      if (tag === 'u') {
        const inner = parseInline(tokens, tag, i + 1, [...formatStack, FORMAT_UNDERLINE]);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      if (tag === 'code') {
        const inner = parseInline(tokens, tag, i + 1, [...formatStack, FORMAT_CODE]);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      if (tag === 'a') {
        const href = t.attrs.href ?? '#';
        const newTab = (t.attrs.target ?? '').toLowerCase() === '_blank';
        const inner = parseInline(tokens, 'a', i + 1, formatStack);
        // Links wrap text nodes; drop any link children.
        const textChildren = inner.nodes.filter((n): n is LexicalText => n.type === 'text');
        out.push({
          type: 'link',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          fields: { url: href, newTab, linkType: 'custom' },
          children: textChildren.length > 0 ? textChildren : [makeText(href, 0)],
        });
        i = inner.next;
        continue;
      }
      if (tag === 'span') {
        // Treat <span> as transparent wrapper.
        const inner = parseInline(tokens, 'span', i + 1, formatStack);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      // Unknown inline tag — skip it but keep children.
      if (INLINE_TAGS.has(tag)) {
        const inner = parseInline(tokens, tag, i + 1, formatStack);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }
      // Block tag encountered in inline context — bail out (parent handles it).
      if (endTag === null) {
        break;
      }
      // If we're inside an inline container and hit a block, treat children as text + skip.
      const inner = parseInline(tokens, tag, i + 1, formatStack);
      out.push(...inner.nodes);
      i = inner.next;
      continue;
    }
    // Unmatched close — skip.
    i++;
  }
  return { nodes: out, next: i };
}

function parseBlockChildren(tokens: Token[], endTag: string | null, start: number): { nodes: LexicalBlock[]; next: number } {
  const out: LexicalBlock[] = [];
  let i = start;

  while (i < tokens.length) {
    const t = tokens[i];

    if (t.kind === 'close' && endTag && t.tag === endTag) {
      return { nodes: out, next: i + 1 };
    }

    if (t.kind === 'text') {
      const text = decodeEntities(t.value).trim();
      if (text) {
        out.push(makeParagraph([makeText(text, 0)]));
      }
      i++;
      continue;
    }

    if (t.kind === 'open') {
      const tag = t.tag;

      if (IGNORE_TAGS.has(tag)) {
        i = skipTo(tokens, i + 1, tag);
        continue;
      }

      if (/^h[1-6]$/.test(tag)) {
        const inner = parseInline(tokens, tag, i + 1, []);
        out.push(makeHeading(tag as LexicalHeading['tag'], inner.nodes));
        i = inner.next;
        continue;
      }

      if (tag === 'p') {
        const inner = parseInline(tokens, 'p', i + 1, []);
        if (inner.nodes.length > 0) out.push(makeParagraph(inner.nodes));
        else out.push(makeParagraph([makeText('', 0)]));
        i = inner.next;
        continue;
      }

      if (tag === 'ul' || tag === 'ol') {
        const items: LexicalListItem[] = [];
        let j = i + 1;
        let itemValue = 1;
        while (j < tokens.length) {
          const inner = tokens[j];
          if (inner.kind === 'close' && inner.tag === tag) {
            j++;
            break;
          }
          if (inner.kind === 'open' && inner.tag === 'li') {
            const liContent = parseInline(tokens, 'li', j + 1, []);
            items.push(makeListItem(liContent.nodes, itemValue++));
            j = liContent.next;
            continue;
          }
          j++;
        }
        out.push(makeList(tag, items));
        i = j;
        continue;
      }

      if (tag === 'blockquote') {
        // Render blockquote as a single paragraph (Lexical has no quote type without plugins).
        const inner = parseBlockChildren(tokens, 'blockquote', i + 1);
        const flattened: LexicalInline[] = [];
        for (const child of inner.nodes) {
          if (child.type === 'paragraph' || child.type === 'heading') {
            flattened.push(...child.children);
          }
        }
        if (flattened.length > 0) out.push(makeParagraph(flattened));
        i = inner.next;
        continue;
      }

      if (tag === 'br') {
        i++;
        continue;
      }

      // Container-style block tags — recurse.
      if (['div', 'section', 'article', 'main', 'header', 'footer', 'aside', 'figure'].includes(tag)) {
        const inner = parseBlockChildren(tokens, tag, i + 1);
        out.push(...inner.nodes);
        i = inner.next;
        continue;
      }

      // Inline-looking tag at block level — wrap in a paragraph.
      if (INLINE_TAGS.has(tag)) {
        const inner = parseInline(tokens, null, i, []);
        if (inner.nodes.length > 0) out.push(makeParagraph(inner.nodes));
        i = inner.next;
        continue;
      }

      // Unknown tag — try to recurse as container.
      if (t.selfClosing || SELF_CLOSING.has(tag)) {
        i++;
        continue;
      }
      const inner = parseBlockChildren(tokens, tag, i + 1);
      out.push(...inner.nodes);
      i = inner.next;
      continue;
    }

    i++;
  }
  return { nodes: out, next: i };
}

function skipTo(tokens: Token[], start: number, tag: string): number {
  let depth = 1;
  let i = start;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.kind === 'open' && t.tag === tag && !t.selfClosing) depth++;
    else if (t.kind === 'close' && t.tag === tag) {
      depth--;
      if (depth <= 0) return i + 1;
    }
    i++;
  }
  return i;
}

/**
 * Top-level entry. Input: HTML fragment (no <html>/<body> needed — but works
 * with them too). Output: Lexical editor state ready to save in a richText
 * field.
 */
export function htmlToLexical(html: string): LexicalRoot {
  const cleaned = (html ?? '').trim();
  if (!cleaned) return emptyLexical();

  const tokens = tokenize(cleaned);
  const { nodes } = parseBlockChildren(tokens, null, 0);

  if (nodes.length === 0) {
    return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [makeParagraph([makeText('', 0)])] } };
  }
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes } };
}

export function emptyLexical(): LexicalRoot {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [makeParagraph([makeText('', 0)])],
    },
  };
}

/**
 * Build a simple Lexical doc from a plain string (wraps in a single paragraph).
 * Used as a fallback when AI returns plain-text body instead of HTML.
 */
export function plainTextToLexical(text: string): LexicalRoot {
  if (!text) return emptyLexical();
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: text
        .split(/\n{2,}/)
        .map((para) => makeParagraph([makeText(para.trim(), 0)])),
    },
  };
}
