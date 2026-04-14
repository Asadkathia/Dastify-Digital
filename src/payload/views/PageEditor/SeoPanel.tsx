'use client';

/**
 * SeoPanel — slide-out panel for editing SEO fields on the current page.
 * Covers meta title, meta description, og:image, canonical slug, and noindex toggle.
 * Reads from the Payload pages API and PATCHes on save.
 */

import { useEffect, useRef, useState } from 'react';
import { MediaLibraryModal } from './MediaLibraryModal';

type SeoData = {
  slug: string;
  meta?: {
    title?: string;
    description?: string;
    image?: { url?: string; filename?: string; id?: string | number } | string | null;
  };
  noindex?: boolean;
};

type Props = {
  pageId: string;
  onClose: () => void;
  /** Called after a successful PATCH so the toolbar can sync the slug display */
  onSlugChange?: (newSlug: string) => void;
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

const hintStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#444',
  marginTop: '3px',
  lineHeight: 1.4,
};

function imgSrcFromMeta(meta: SeoData['meta']): string {
  const img = meta?.image;
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (img.url) return img.url;
  if (img.filename) return `/media/${img.filename}`;
  return '';
}

export function SeoPanel({ pageId, onClose, onSlugChange }: Props) {
  const [data, setData] = useState<SeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Local form state
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImageSrc, setOgImageSrc] = useState('');
  const [ogImageId, setOgImageId] = useState<string | number | null>(null);
  const [noindex, setNoindex] = useState(false);

  useEffect(() => {
    if (!pageId) { setLoading(false); return; }
    fetch(`/api/pages/${pageId}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((doc) => {
        if (!doc) return;
        const d = doc as SeoData;
        setData(d);
        setSlug(d.slug ?? '');
        setMetaTitle(d.meta?.title ?? '');
        setMetaDesc(d.meta?.description ?? '');
        setOgImageSrc(imgSrcFromMeta(d.meta));
        const img = d.meta?.image;
        if (img && typeof img === 'object' && 'id' in img) setOgImageId(img.id ?? null);
        setNoindex(d.noindex ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageId]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (showLibrary) return; // don't close panel while media modal is open
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, showLibrary]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape' && !showLibrary) onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, showLibrary]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!pageId) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const body: Record<string, unknown> = {
        slug: slug.trim().replace(/^\/+/, ''),
        noindex,
        meta: {
          title: metaTitle.trim() || undefined,
          description: metaDesc.trim() || undefined,
          image: ogImageId ?? (ogImageSrc.trim() || undefined),
        },
      };
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
      if (onSlugChange && body.slug !== data?.slug) onSlugChange(body.slug as string);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Could not save SEO settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const titleLen = metaTitle.length;
  const descLen = metaDesc.length;

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
          width: '400px',
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
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>SEO Settings</h2>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#555' }}>
              Meta tags, Open Graph &amp; URL
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Loading…</div>
        ) : (
          <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* URL Slug */}
            <section>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>URL</p>
              <div>
                <label style={labelStyle}>Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#555', flexShrink: 0 }}>/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.replace(/^\/+/, '').replace(/\s+/g, '-').toLowerCase())}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="page-slug"
                    spellCheck={false}
                    required
                  />
                </div>
                <p style={hintStyle}>Changing the slug will break existing links to this page.</p>
              </div>
            </section>

            {/* Meta Tags */}
            <section>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Meta Tags</p>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="Page title for search engines…"
                />
                <p style={{ ...hintStyle, color: titleLen > 60 ? '#f87171' : titleLen > 50 ? '#fbbf24' : '#444' }}>
                  {titleLen}/60 characters{titleLen > 60 ? ' — too long' : titleLen > 50 ? ' — getting long' : ''}
                </p>
              </div>

              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Brief description for search result snippets…"
                />
                <p style={{ ...hintStyle, color: descLen > 160 ? '#f87171' : descLen > 140 ? '#fbbf24' : '#444' }}>
                  {descLen}/160 characters{descLen > 160 ? ' — too long' : descLen > 140 ? ' — getting long' : ''}
                </p>
              </div>
            </section>

            {/* Open Graph Image */}
            <section>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Open Graph Image</p>
              {ogImageSrc && (
                <div style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e1e1e', aspectRatio: '1200/630', background: '#0a0a0a' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImageSrc} alt="OG preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={ogImageSrc}
                  onChange={(e) => { setOgImageSrc(e.target.value); setOgImageId(null); }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="https://… or /media/…"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowLibrary(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #0ea5e9',
                    borderRadius: '6px',
                    color: '#0ea5e9',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '6px 10px',
                    flexShrink: 0,
                  }}
                >
                  Browse
                </button>
                {ogImageSrc && (
                  <button
                    type="button"
                    onClick={() => { setOgImageSrc(''); setOgImageId(null); }}
                    style={{
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '6px 10px',
                      flexShrink: 0,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p style={hintStyle}>Recommended: 1200×630px. Shown when shared on social media.</p>
            </section>

            {/* Indexing */}
            <section>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Indexing</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 12px' }}>
                <input
                  type="checkbox"
                  id="seo-noindex"
                  checked={noindex}
                  onChange={(e) => setNoindex(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#f87171', cursor: 'pointer', flexShrink: 0 }}
                />
                <div>
                  <label htmlFor="seo-noindex" style={{ fontSize: '12px', color: '#e5e5e5', cursor: 'pointer', display: 'block', marginBottom: '2px' }}>
                    Hide from search engines (noindex)
                  </label>
                  <p style={{ margin: 0, fontSize: '10px', color: '#555' }}>
                    Adds a noindex meta tag. Use for thank-you pages, login pages, etc.
                  </p>
                </div>
              </div>
            </section>

            {/* SERP Preview */}
            {(metaTitle || metaDesc) && (
              <section>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Search Preview</p>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '18px', color: '#1a0dab', fontFamily: 'Arial, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {metaTitle || 'Page Title'}
                  </p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#006621', fontFamily: 'Arial, sans-serif' }}>
                    https://yoursite.com/{slug || 'page'}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#545454', fontFamily: 'Arial, sans-serif', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {metaDesc || 'Meta description will appear here…'}
                  </p>
                </div>
              </section>
            )}

            {error && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{error}</p>}
            {success && <p style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}>SEO settings saved.</p>}

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '10px',
                background: saving ? '#1e3a5f' : '#0ea5e9',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.7 : 1,
                marginTop: '4px',
              }}
            >
              {saving ? 'Saving…' : 'Save SEO Settings'}
            </button>
          </form>
        )}
      </div>

      {showLibrary && (
        <MediaLibraryModal
          onSelect={(media) => {
            const src = media.url || (media.filename ? `/media/${media.filename}` : '');
            setOgImageSrc(src);
            setOgImageId(media.id);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </>
  );
}
