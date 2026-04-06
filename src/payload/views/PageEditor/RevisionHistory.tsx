'use client';

import { useEffect, useState } from 'react';
import { useEditorStore, deserializeSectionsFromPayload } from './store';

type Version = {
  id: string;
  updatedAt: string;
  autosave?: boolean;
  version: {
    _status?: string;
  };
};

type RevisionHistoryProps = {
  pageId: string;
  onClose: () => void;
};

export function RevisionHistory({ pageId, onClose }: RevisionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const setSections = useEditorStore((s) => s.setSections);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/pages/versions?where[parent][equals]=${pageId}&sort=-updatedAt&limit=25&depth=0`,
      { credentials: 'include' },
    )
      .then((r) => r.json())
      .then((data: { docs?: Version[] }) => {
        setVersions(data.docs ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageId]);

  async function restoreVersion(versionId: string) {
    setRestoring(versionId);
    try {
      const res = await fetch(`/api/pages/versions/${versionId}`, { credentials: 'include' });
      if (!res.ok) return;
      const data: { version?: { blocks?: Record<string, unknown>[] } } = await res.json();
      const blocks = data.version?.blocks;
      if (Array.isArray(blocks)) {
        setSections(deserializeSectionsFromPayload(blocks));
        setSaveStatus('dirty');
        onClose();
      }
    } catch {
      // silent — user stays on current version
    } finally {
      setRestoring(null);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
      />

      {/* Panel */}
      <aside
        style={{
          position: 'relative',
          width: '320px',
          height: '100%',
          background: '#111',
          borderLeft: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 14px',
            borderBottom: '1px solid #222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#ccc' }}>
            Revision History
          </p>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#444', fontSize: '13px' }}>
              Loading versions…
            </div>
          ) : versions.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#444', fontSize: '13px' }}>
              No saved versions yet.
            </div>
          ) : (
            versions.map((v, i) => {
              const status = v.version._status ?? 'draft';
              const isRestoring = restoring === v.id;
              return (
                <div
                  key={v.id}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #1e1e1e',
                    background: '#141414',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 3px', fontSize: '12px', color: '#ccc', fontWeight: 500 }}>
                      {i === 0 ? 'Current version' : `Version ${versions.length - i}`}
                      {v.autosave ? (
                        <span style={{ marginLeft: '6px', fontSize: '10px', color: '#555' }}>auto</span>
                      ) : null}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#555' }}>
                      {formatDate(v.updatedAt)}
                      {' · '}
                      <span
                        style={{
                          color: status === 'published' ? '#4ade80' : '#fb923c',
                          fontWeight: 500,
                        }}
                      >
                        {status}
                      </span>
                    </p>
                  </div>
                  {i !== 0 && (
                    <button
                      onClick={() => restoreVersion(v.id)}
                      disabled={isRestoring}
                      style={{
                        background: isRestoring ? '#0c2a3a' : '#0f2030',
                        border: '1px solid #1e4a6a',
                        borderRadius: '5px',
                        color: isRestoring ? '#555' : '#7dd3fc',
                        cursor: isRestoring ? 'default' : 'pointer',
                        fontSize: '11px',
                        padding: '5px 10px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isRestoring ? '…' : 'Restore'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid #1a1a1a', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#333', lineHeight: 1.5 }}>
            Restoring a version loads it into the editor. Save or publish to make it permanent.
          </p>
        </div>
      </aside>
    </div>
  );
}
