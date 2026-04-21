'use client';

export function CaseStudyConverterNavLink() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
      <a
        href="/admin/convert-case-study"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          background: '#0b1220',
          color: '#f9a8d4',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
        }}
        title="Extract a case study from HTML and upload to the Case Studies collection."
      >
        <span aria-hidden>✦</span>
        <span>Convert Case Study</span>
      </a>
    </div>
  );
}
