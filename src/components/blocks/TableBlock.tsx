export type TableBlockProps = {
  type: 'table';
  title?: string;
  caption?: string;
  headers?: Array<{ label: string }>;
  rows?: Array<{ cells: Array<{ value: string }> }>;
  striped?: boolean;
  bordered?: boolean;
  responsive?: boolean;
};

export function TableBlock({ title, caption, headers = [], rows = [], striped = true, bordered = false }: TableBlockProps) {
  return (
    <div style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {title && <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>{title}</h2>}
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: bordered ? '1px solid #e2e8f0' : 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            {caption && <caption style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', textAlign: 'left' }}>{caption}</caption>}
            {headers.length > 0 && (
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {headers.map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: striped && ri % 2 === 1 ? '#f8fafc' : '#fff', borderBottom: '1px solid #e2e8f0' }}>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} style={{ padding: '12px 16px', color: '#334155', borderRight: bordered && ci < row.cells.length - 1 ? '1px solid #e2e8f0' : 'none' }}>{cell.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
