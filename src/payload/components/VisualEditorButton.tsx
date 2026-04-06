'use client';

type VisualEditorButtonProps = {
  rowData?: { id?: string | number };
};

export function VisualEditorButton({ rowData }: VisualEditorButtonProps) {
  const id = rowData?.id;
  if (!id) return null;

  return (
    <a
      href={`/admin/visual-editor/${id}`}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: '#0c1a24',
        border: '1px solid #0369a1',
        borderRadius: '6px',
        color: '#38bdf8',
        fontSize: '11px',
        fontWeight: 600,
        padding: '4px 10px',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = '#0f2536')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = '#0c1a24')}
    >
      ✏️ Visual Editor
    </a>
  );
}
