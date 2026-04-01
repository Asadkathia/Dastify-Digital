import React from 'react';

function getPreviewHref(): string {
  const secret = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET;
  const params = new URLSearchParams({
    slug: '/',
  });

  if (secret) {
    params.set('secret', secret);
  }

  return `/api/preview?${params.toString()}`;
}

export function HomepagePreviewLink() {
  return (
    <a
      href={getPreviewHref()}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '38px',
        padding: '0 14px',
        border: '1px solid var(--theme-elevation-250)',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      Preview Site
    </a>
  );
}
