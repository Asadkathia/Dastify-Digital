'use client';

import { useEffect, useRef } from 'react';

export type CustomHtmlBlockProps = {
  type: 'custom_html';
  html: string;
  label?: string;
};

export function CustomHtmlBlock({ html, label }: CustomHtmlBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedHtml = html
    .replace(/\sdata-r(?:=(?:"true"|'true'))?/gi, '')
    .replace(/\sdata-delay=(?:"[^"]*"|'[^']*')/gi, '');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Converted HTML often relies on a scroll-reveal controller that is not
    // present in generic CMS rendering. Force those nodes visible.
    const revealNodes = root.querySelectorAll<HTMLElement>('[data-r]');
    for (const node of revealNodes) {
      node.classList.add('revealed');
    }
  }, [normalizedHtml]);

  return (
    <div ref={rootRef}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml */}
      <div
        data-block-label={label || undefined}
        dangerouslySetInnerHTML={{ __html: normalizedHtml }}
      />
    </div>
  );
}
