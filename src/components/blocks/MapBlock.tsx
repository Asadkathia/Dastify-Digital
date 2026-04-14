export type MapBlockProps = {
  type: 'map';
  title?: string;
  address?: string;
  embedUrl?: string;
  height?: number;
  borderRadius?: number;
  showAddressCard?: boolean;
  phone?: string;
  hours?: string;
};

export function MapBlock({ title, address, embedUrl, height = 400, borderRadius = 12, showAddressCard = true, phone, hours }: MapBlockProps) {
  return (
    <div style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {title && <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px', textAlign: 'center' }}>{title}</h2>}
        <div style={{ position: 'relative', borderRadius: `${borderRadius}px`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height={height}
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title ?? 'Map'}
            />
          ) : (
            <div style={{ height: `${height}px`, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
              📍 Add a Google Maps embed URL to show the map
            </div>
          )}
          {showAddressCard && (address || phone || hours) && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#fff', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxWidth: '280px' }}>
              {address && <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{address}</p>}
              {phone && <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>📞 {phone}</p>}
              {hours && <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>🕐 {hours}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
