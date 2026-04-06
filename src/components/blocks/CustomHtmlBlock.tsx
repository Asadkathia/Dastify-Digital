export type CustomHtmlBlockProps = {
  type: 'custom_html';
  html: string;
  label?: string;
};

export function CustomHtmlBlock({ html, label }: CustomHtmlBlockProps) {
  return (
    <div style={{ padding: '8px 0' }}>
      {label && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', margin: '0 0 8px', fontFamily: 'monospace' }}>
          — {label} —
        </p>
      )}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
