'use client';

export function PageImporterNavLink() {
  return (
    <a
      href="/admin/import-page"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '8px 0',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #1f2937',
        background: '#0b1220',
        color: '#93c5fd',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      <span aria-hidden>⬆</span>
      <span>Import Page</span>
    </a>
  );
}
