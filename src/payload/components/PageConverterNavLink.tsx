'use client';

export function PageConverterNavLink() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
      <a
        href="/admin/convert-page"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
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
        <span aria-hidden>✦</span>
        <span>Convert Page</span>
      </a>
      <a
        href="/admin/converted-pages"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          background: '#0b1220',
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        <span aria-hidden>⊞</span>
        <span>Converted Pages</span>
      </a>
    </div>
  );
}
