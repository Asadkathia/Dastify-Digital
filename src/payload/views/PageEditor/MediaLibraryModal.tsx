'use client';

/**
 * MediaLibraryModal — browse and select existing Payload media assets.
 * Opens as a full-screen overlay. Calls onSelect(mediaObj) when user picks an image.
 */

import { useEffect, useRef, useState } from 'react';

type MediaDoc = {
  id: string | number;
  filename: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  filesize?: number;
  createdAt?: string;
};

type Props = {
  onSelect: (media: MediaDoc) => void;
  onClose: () => void;
};

const LIMIT = 24;

function humanSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibraryModal({ onSelect, onClose }: Props) {
  const [docs, setDocs] = useState<MediaDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState<string | number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(LIMIT),
      page: String(page),
      sort: '-createdAt',
    });
    if (search.trim()) params.set('where[or][0][filename][like]', search.trim());

    fetch(`/api/media?${params}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { docs: [], totalPages: 1 })
      .then((data) => {
        setDocs((data.docs ?? []) as MediaDoc[]);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [page, search]);

  // Debounced search
  function handleSearchChange(val: string) {
    setSearchInput(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, '') }));
      const res = await fetch('/api/media', { method: 'POST', credentials: 'include', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const raw = await res.json() as { doc?: MediaDoc };
      const uploaded = raw.doc;
      if (uploaded) {
        setDocs((prev) => [uploaded, ...prev]);
        onSelect(uploaded);
      }
    } catch {
      window.alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const imgSrc = (doc: MediaDoc) =>
    doc.url || (doc.filename ? `/media/${doc.filename}` : '');

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.85)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#0d0d0d', width: '100%', maxWidth: '1000px', margin: 'auto', borderRadius: '12px', display: 'flex', flexDirection: 'column', maxHeight: '85vh', border: '1px solid #1e1e1e' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#e5e5e5', flex: 1 }}>Media Library</h2>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search files…"
            style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#e5e5e5', fontSize: '12px', padding: '6px 10px', outline: 'none', width: '200px' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ background: '#0ea5e9', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '7px 14px', cursor: uploading ? 'default' : 'pointer', opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? 'Uploading…' : '+ Upload'}
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#555', padding: '48px', fontSize: '13px' }}>Loading…</div>
          ) : docs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#555', padding: '48px', fontSize: '13px' }}>
              {search ? `No files matching "${search}"` : 'No media files yet. Upload one above.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {docs.map((doc) => {
                const src = imgSrc(doc);
                const isImage = doc.mimeType?.startsWith('image/') ?? src.match(/\.(jpe?g|png|gif|webp|svg|avif)$/i) !== null;
                return (
                  <button
                    key={doc.id}
                    onClick={() => onSelect(doc)}
                    onMouseEnter={() => setHover(doc.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      background: hover === doc.id ? '#1a1a1a' : '#111',
                      border: `1px solid ${hover === doc.id ? '#0ea5e9' : '#1e1e1e'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div style={{ height: '100px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {isImage && src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={doc.alt || doc.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '28px' }}>📄</span>
                      )}
                    </div>
                    <div style={{ padding: '8px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.filename}>
                        {doc.filename}
                      </p>
                      <p style={{ margin: 0, fontSize: '10px', color: '#555' }}>
                        {doc.width && doc.height ? `${doc.width}×${doc.height} · ` : ''}{humanSize(doc.filesize)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: page === 1 ? '#333' : '#888', fontSize: '12px', padding: '4px 10px', cursor: page === 1 ? 'default' : 'pointer' }}
            >
              ‹ Prev
            </button>
            <span style={{ fontSize: '12px', color: '#555' }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: page === totalPages ? '#333' : '#888', fontSize: '12px', padding: '4px 10px', cursor: page === totalPages ? 'default' : 'pointer' }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
