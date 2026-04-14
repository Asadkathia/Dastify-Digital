'use client';

/**
 * RedirectsPanel — slide-out panel for managing redirects for the current page.
 * Lets editors create, view, and delete redirects without leaving the visual editor.
 */

import { useEffect, useState, useRef } from 'react';

type Redirect = {
  id: string;
  from: { url: string };
  to: { url: string; type?: string };
  type?: '301' | '302';
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#e5e5e5',
  fontSize: '12px',
  padding: '8px 10px',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#555',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

type Props = {
  /** The slug/path of the current page, used as the default "from" URL. */
  currentSlug?: string;
  onClose: () => void;
};

export function RedirectsPanel({ currentSlug, onClose }: Props) {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromUrl, setFromUrl] = useState(currentSlug ? `/${currentSlug}` : '/');
  const [toUrl, setToUrl] = useState('');
  const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch existing redirects for this slug
  useEffect(() => {
    if (!currentSlug) { setLoading(false); return; }
    fetch(`/api/redirects?where[from.url][contains]=${encodeURIComponent(currentSlug)}&limit=20`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { docs: [] })
      .then((data) => setRedirects((data.docs ?? []) as Redirect[]))
      .catch(() => setRedirects([]))
      .finally(() => setLoading(false));
  }, [currentSlug]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!fromUrl.trim() || !toUrl.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          from: { url: fromUrl.trim() },
          to: { url: toUrl.trim(), type: 'custom' },
          type: redirectType,
        }),
      });
      if (!res.ok) throw new Error('Failed to create redirect');
      const created = await res.json() as { doc?: Redirect };
      if (created.doc) setRedirects((prev) => [created.doc!, ...prev]);
      setToUrl('');
    } catch {
      setError('Could not create redirect. Check the Payload Redirects collection is configured.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this redirect?')) return;
    try {
      await fetch(`/api/redirects/${id}`, { method: 'DELETE', credentials: 'include' });
      setRedirects((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // silent fail — user can retry
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          height: '100vh',
          background: '#0d0d0d',
          borderLeft: '1px solid #1e1e1e',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>Redirects</h2>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#555' }}>
              Manage URL redirects for this page
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}>×</button>
        </div>

        {/* Create form */}
        <form onSubmit={handleCreate} style={{ padding: '16px', borderBottom: '1px solid #1e1e1e' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Add Redirect</p>
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>From URL</label>
            <input
              type="text"
              value={fromUrl}
              onChange={(e) => setFromUrl(e.target.value)}
              style={inputStyle}
              placeholder="/old-path"
              required
              spellCheck={false}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>To URL</label>
            <input
              type="text"
              value={toUrl}
              onChange={(e) => setToUrl(e.target.value)}
              style={inputStyle}
              placeholder="/new-path or https://example.com"
              required
              spellCheck={false}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Redirect Type</label>
            <select
              value={redirectType}
              onChange={(e) => setRedirectType(e.target.value as '301' | '302')}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="301">301 — Permanent</option>
              <option value="302">302 — Temporary</option>
            </select>
          </div>
          {error && <p style={{ fontSize: '12px', color: '#f87171', margin: '0 0 8px' }}>{error}</p>}
          <button
            type="submit"
            disabled={saving || !fromUrl.trim() || !toUrl.trim()}
            style={{
              width: '100%',
              padding: '8px',
              background: saving ? '#1e3a5f' : '#0ea5e9',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Creating…' : '+ Add Redirect'}
          </button>
        </form>

        {/* Existing redirects */}
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
            Existing Redirects {redirects.length > 0 ? `(${redirects.length})` : ''}
          </p>
          {loading ? (
            <p style={{ color: '#555', fontSize: '13px' }}>Loading…</p>
          ) : redirects.length === 0 ? (
            <p style={{ color: '#444', fontSize: '13px', fontStyle: 'italic' }}>No redirects for this page yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {redirects.map((r) => (
                <div key={r.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#e5e5e5', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.from?.url}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#555' }}>
                      → <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{r.to?.url}</span>
                      <span style={{ marginLeft: '6px', background: '#1e1e1e', padding: '1px 5px', borderRadius: '3px', fontSize: '10px', color: '#666' }}>{r.type ?? '301'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', padding: '2px 4px', flexShrink: 0 }}
                    title="Delete redirect"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
