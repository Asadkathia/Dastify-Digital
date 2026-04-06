'use client';

import { useDocumentInfo } from '@payloadcms/ui';

export function VisualEditorDocButton() {
  const { id } = useDocumentInfo();

  if (!id) return null;

  return (
    <a
      href={`/admin/visual-editor/${id}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#0c1a24',
        border: '1px solid #0369a1',
        borderRadius: '6px',
        color: '#38bdf8',
        fontSize: '12px',
        fontWeight: 600,
        padding: '6px 14px',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = '#0f2536')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = '#0c1a24')}
    >
      ✏️ Open Visual Editor
    </a>
  );
}
