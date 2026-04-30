import type { ReactNode } from 'react';

// Render a string containing a limited subset of HTML (<em>…</em> and \n) as
// ReactNode. This keeps <em> italic-serif accents expressible in the content
// layer without dangerouslySetInnerHTML.
export function renderEmHtml(input: string | null | undefined): ReactNode {
  if (!input) return null;
  const lines = input.split('\n');
  const out: ReactNode[] = [];
  lines.forEach((line, lineIdx) => {
    const parts = line.split(/(<em>.*?<\/em>)/g);
    parts.forEach((part, i) => {
      const match = part.match(/^<em>(.*?)<\/em>$/);
      if (match) out.push(<em key={`${lineIdx}-${i}`}>{match[1]}</em>);
      else if (part.length > 0) out.push(part);
    });
    if (lineIdx < lines.length - 1) out.push(<br key={`br-${lineIdx}`} />);
  });
  return out;
}

// HTML-escape user text so the only structured tags that survive are the
// `<em>` and `<br>` we explicitly emit. Used by `renderEmHtmlString`.
function escapeText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * String-returning variant of `renderEmHtml`. Use this when the rendered
 * content lives inside an inline-editable element — feed the result into
 * `dangerouslySetInnerHTML` so React doesn't manage the structured children.
 *
 * Why: contenteditable mutates child nodes in place (merging text nodes,
 * inserting `<br>` on Enter, etc.). When the editable element has React-owned
 * `<em>` / `<br>` children, the next render's reconciler tries to remove
 * stale node references and crashes with "removeChild ... not a child of this
 * node". `dangerouslySetInnerHTML` makes the parent React's only managed unit
 * — every render replaces innerHTML wholesale, never touching descendants.
 */
export function renderEmHtmlString(input: string | null | undefined): string {
  if (!input) return '';
  const lines = input.split('\n');
  const out: string[] = [];
  lines.forEach((line, lineIdx) => {
    const parts = line.split(/(<em>.*?<\/em>)/g);
    parts.forEach((part) => {
      const match = part.match(/^<em>(.*?)<\/em>$/);
      if (match) out.push(`<em>${escapeText(match[1] ?? '')}</em>`);
      else if (part.length > 0) out.push(escapeText(part));
    });
    if (lineIdx < lines.length - 1) out.push('<br>');
  });
  return out.join('');
}
