'use client';

export function ServiceConverterNavLink() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
      <a
        href="/admin/convert-service"
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
        title="Extract a service from HTML and upload to the Services collection."
      >
        <span aria-hidden>✦</span>
        <span>Convert Service</span>
      </a>
    </div>
  );
}
