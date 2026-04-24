import type { ReactNode } from 'react';

// Render a string containing a limited subset of HTML (<em>…</em> and \n) as
// ReactNode. This keeps <em> italic-serif accents expressible in the content
// layer without dangerouslySetInnerHTML.
export function renderEmHtml(input: string): ReactNode {
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
