'use client';

export function BlogPostConverterNavLink() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
      <a
        href="/admin/convert-blog-post"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          background: '#0b1220',
          color: '#86efac',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
        }}
        title="Extract a blog post from HTML and upload to the Blog Posts collection."
      >
        <span aria-hidden>✦</span>
        <span>Convert Blog Post</span>
      </a>
    </div>
  );
}
