'use client';

import '../../admin.css';
import { useEffect, useState } from 'react';
import { adminStyles, Button, StatusMessage } from '../_shared';
import type { UploadReport } from '@/lib/converted-pages/upload-report';

type ConvertedPage = {
  name: string;
  route: string;
  files: string[];
};

type ResultTone = 'success' | 'error' | 'conflict';
type Result = {
  type: ResultTone;
  message: string;
  adminUrl?: string;
  report?: UploadReport;
};

export default function ConvertedPagesView() {
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [moreOpen, setMoreOpen] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, Result>>({});

  useEffect(() => {
    fetch('/api/admin/converted-pages')
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages ?? []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('[ConvertedPages] failed to load:', e);
        setError(e instanceof Error ? e.message : 'Failed to load converted pages.');
        setLoading(false);
      });
  }, []);

  async function uploadToCMS(pageName: string) {
    setUploading((prev) => ({ ...prev, [pageName]: true }));
    setResults((prev) => {
      const next = { ...prev };
      delete next[pageName];
      return next;
    });

    try {
      const res = await fetch('/api/admin/upload-converted-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageName }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        pageId?: string;
        adminUrl?: string | null;
        report?: UploadReport;
      };

      if (res.ok && data.ok) {
        setResults((prev) => ({
          ...prev,
          [pageName]: {
            type: 'success',
            message: 'Uploaded to CMS as draft.',
            adminUrl: data.adminUrl ?? undefined,
            report: data.report ?? undefined,
          },
        }));
        return;
      }

      if (res.status === 409) {
        setResults((prev) => ({
          ...prev,
          [pageName]: {
            type: 'conflict',
            message: data.error || 'Already exists in CMS.',
            adminUrl: data.adminUrl ?? undefined,
          },
        }));
        return;
      }

      setResults((prev) => ({
        ...prev,
        [pageName]: { type: 'error', message: data.error || 'Upload failed.' },
      }));
    } catch (err) {
      console.error('[ConvertedPages] upload failed:', err);
      setResults((prev) => ({
        ...prev,
        [pageName]: {
          type: 'error',
          message: err instanceof Error ? err.message : 'Upload failed.',
        },
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [pageName]: false }));
    }
  }

  async function deletePage(pageName: string) {
    if (!window.confirm(`Delete /${pageName} from disk? This cannot be undone.`)) return;
    setDeleting((prev) => ({ ...prev, [pageName]: true }));
    setResults((prev) => {
      const next = { ...prev };
      delete next[pageName];
      return next;
    });

    try {
      const res = await fetch('/api/admin/converted-pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageName }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setPages((prev) => prev.filter((p) => p.name !== pageName));
      } else {
        setResults((prev) => ({
          ...prev,
          [pageName]: { type: 'error', message: data.error || 'Delete failed.' },
        }));
      }
    } catch (err) {
      console.error('[ConvertedPages] delete failed:', err);
      setResults((prev) => ({
        ...prev,
        [pageName]: {
          type: 'error',
          message: err instanceof Error ? err.message : 'Delete failed.',
        },
      }));
    } finally {
      setDeleting((prev) => ({ ...prev, [pageName]: false }));
    }
  }

  return (
    <div data-admin-view="converted-pages" style={adminStyles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--admin-space-1)' }}>
        <h1 style={adminStyles.heading1}>Converted Pages</h1>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = '/admin/convert-page';
          }}
        >
          + Convert New Page
        </Button>
      </div>
      <p style={{ margin: '0 0 var(--admin-space-6)', color: 'var(--admin-text-tertiary)', fontSize: 'var(--admin-text-md)' }}>
        Pages generated by the AI page converter — available at their route URLs.
      </p>

      {loading && <p style={{ color: 'var(--admin-text-tertiary)' }}>Loading…</p>}
      {error && <StatusMessage tone="error">{error}</StatusMessage>}

      {!loading && !error && pages.length === 0 && (
        <div
          style={{
            padding: 'var(--admin-space-6)',
            textAlign: 'center',
            border: '1px dashed var(--admin-border)',
            borderRadius: 'var(--admin-radius-lg)',
            color: 'var(--admin-text-tertiary)',
          }}
        >
          <p style={{ fontSize: 'var(--admin-text-lg)', marginBottom: 'var(--admin-space-3)' }}>
            No converted pages yet.
          </p>
          <a href="/admin/convert-page" style={{ color: 'var(--admin-accent-text)', fontSize: 'var(--admin-text-md)' }}>
            Convert your first page →
          </a>
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 'var(--admin-space-4)' }}>
          {pages.map((page) => {
            const canEdit = page.files.some((f) => f.endsWith('/content.ts'));
            const isMoreOpen = !!moreOpen[page.name];
            const result = results[page.name];
            return (
              <div key={page.name} style={adminStyles.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--admin-space-3)' }}>
                  <span style={{ fontFamily: 'var(--admin-font-mono)', fontSize: 'var(--admin-text-lg)', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                    /{page.name}
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                    <Button
                      size="sm"
                      variant="primary"
                      loading={uploading[page.name]}
                      onClick={() => uploadToCMS(page.name)}
                    >
                      {uploading[page.name] ? 'Uploading…' : 'Upload to CMS'}
                    </Button>
                    {canEdit ? (
                      <a
                        href={`/admin/edit-converted-page/${page.name}`}
                        style={{
                          fontSize: 'var(--admin-text-sm)',
                          padding: '4px 10px',
                          background: 'var(--admin-accent-bg)',
                          color: 'var(--admin-accent-text)',
                          borderRadius: 'var(--admin-radius-sm)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          border: '1px solid var(--admin-accent)',
                        }}
                      >
                        Edit ✦
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: 'var(--admin-text-sm)',
                          padding: '4px 10px',
                          background: 'var(--admin-bg-hover)',
                          color: 'var(--admin-text-muted)',
                          borderRadius: 'var(--admin-radius-sm)',
                          fontWeight: 600,
                          fontStyle: 'italic',
                        }}
                        title="Visual editor is available for converted pages with a content.ts file."
                      >
                        No Editor
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label="More actions"
                      aria-expanded={isMoreOpen}
                      onClick={() => setMoreOpen((prev) => ({ ...prev, [page.name]: !prev[page.name] }))}
                      style={{ padding: '2px 8px', fontSize: 14, lineHeight: 1, fontWeight: 700 }}
                    >
                      ⋯
                    </Button>
                  </div>
                </div>

                {isMoreOpen && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--admin-space-2)',
                      marginBottom: 'var(--admin-space-3)',
                      paddingBottom: 'var(--admin-space-3)',
                      borderBottom: '1px solid var(--admin-border-subtle)',
                    }}
                  >
                    <a
                      href={page.route}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 'var(--admin-text-sm)',
                        padding: '4px 10px',
                        background: 'var(--admin-bg-hover)',
                        color: 'var(--admin-accent-text)',
                        borderRadius: 'var(--admin-radius-sm)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      View ↗
                    </a>
                    <a
                      href="/admin/convert-page"
                      style={{
                        fontSize: 'var(--admin-text-sm)',
                        padding: '4px 10px',
                        background: 'var(--admin-bg-hover)',
                        color: 'var(--admin-text-tertiary)',
                        borderRadius: 'var(--admin-radius-sm)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Re-convert
                    </a>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={deleting[page.name]}
                      onClick={() => deletePage(page.name)}
                    >
                      {deleting[page.name] ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                )}

                {result ? (
                  <div style={{ marginBottom: 'var(--admin-space-3)' }}>
                    <StatusMessage tone={result.type === 'conflict' ? 'warning' : result.type}>
                      {result.message}
                      {result.adminUrl ? (
                        <>
                          {' '}
                          <a href={result.adminUrl} style={{ color: 'var(--admin-accent-text)', textDecoration: 'underline' }}>
                            Open
                          </a>
                        </>
                      ) : null}
                    </StatusMessage>
                    {result.report ? (
                      <UploadReportPanel
                        report={result.report}
                        onRerun={() => uploadToCMS(page.name)}
                      />
                    ) : null}
                  </div>
                ) : null}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-1)' }}>
                  {page.files.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: 'var(--admin-text-sm)',
                        color: 'var(--admin-text-tertiary)',
                        fontFamily: 'var(--admin-font-mono)',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

type UploadReportPanelProps = {
  report: UploadReport;
  onRerun: () => void;
};

function UploadReportPanel({ report, onRerun }: UploadReportPanelProps) {
  const verb = report.action === 'created' ? 'Created' : 'Updated';
  const missingAlt = report.imagesMissingAlt.length;
  const visibleWarnings = report.warnings.slice(0, 8);
  const extraWarnings = report.warnings.length - visibleWarnings.length;

  const panelStyle = {
    background: '#111',
    border: '1px solid #222',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    color: '#ccc',
    fontSize: 12,
  } as const;

  const identityStyle = {
    fontSize: 11,
    color: '#777',
    marginBottom: 10,
    fontFamily: 'var(--admin-font-mono)',
    overflowWrap: 'anywhere' as const,
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 8,
    marginBottom: 10,
  };

  const statCardStyle = {
    border: '1px solid #1e1e1e',
    background: '#0a0a0a',
    padding: '8px 10px',
    borderRadius: 6,
  };

  const statLabelStyle = {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    color: '#777',
    letterSpacing: '0.06em',
  };

  const statNumStyle = (amber: boolean) => ({
    fontSize: 18,
    color: amber ? '#fbbf24' : '#ccc',
    fontWeight: 600,
    lineHeight: 1.2,
  });

  const sectionRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 0',
    borderBottom: '1px solid #181818',
  };

  const chipStyle = (fg: string, bg: string) => ({
    fontSize: 10,
    padding: '1px 6px',
    borderRadius: 4,
    color: fg,
    background: bg,
    fontWeight: 600,
  });

  const detailsSummaryStyle = {
    cursor: 'pointer',
    fontSize: 11,
    color: '#777',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    padding: '4px 0',
    userSelect: 'none' as const,
  };

  const sectionGroupStyle = { marginBottom: 10 };

  const groupHeaderStyle = {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    color: '#777',
    letterSpacing: '0.06em',
    marginBottom: 4,
  };

  const warningRowStyle = {
    display: 'flex',
    gap: 6,
    alignItems: 'baseline',
    padding: '3px 0',
    fontSize: 11,
    flexWrap: 'wrap' as const,
  };

  const codeStyle = {
    fontFamily: 'var(--admin-font-mono)',
    color: '#777',
    fontSize: 10,
  };

  const pathSuffixStyle = {
    fontFamily: 'var(--admin-font-mono)',
    color: '#555',
    fontSize: 10,
  };

  const actionsRowStyle = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    marginTop: 10,
  };

  const primaryActionStyle = {
    background: '#0ea5e9',
    color: '#06131a',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid #0ea5e9',
  };

  const secondaryActionStyle = {
    background: 'transparent',
    color: '#ccc',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid #2a2a2a',
  };

  const ghostActionStyle = {
    background: 'transparent',
    color: '#7dd3fc',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  const fallbackNoteStyle = {
    marginTop: 10,
    border: '1px solid #3a2a07',
    background: '#1c1407',
    color: '#fbbf24',
    padding: '8px 10px',
    borderRadius: 6,
    fontSize: 11,
  };

  return (
    <div style={panelStyle}>
      <div style={identityStyle}>
        {verb} · #{report.pageId} · slug={report.slug} · convertedPageName=
        {report.convertedPageName ?? '(none)'} · title=&quot;{report.title}&quot;
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Sections</div>
          <div style={statNumStyle(false)}>{report.sectionCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Editable fields</div>
          <div style={statNumStyle(false)}>{report.editableFieldCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>
            Images{missingAlt > 0 ? ` · ${missingAlt} missing alt` : ''}
          </div>
          <div style={statNumStyle(missingAlt > 0)}>{report.imageFields.length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>CTAs</div>
          <div style={statNumStyle(false)}>{report.ctaFields.length}</div>
        </div>
      </div>

      {report.sections.length > 0 ? (
        <details style={sectionGroupStyle}>
          <summary style={detailsSummaryStyle}>
            Sections ({report.sections.length})
          </summary>
          <div style={{ marginTop: 4 }}>
            {report.sections.map((s) => (
              <div key={s.key} style={sectionRowStyle}>
                <span>{s.hidden ? '👁‍🗨' : '✓'}</span>
                <span style={{ color: '#ccc', flex: '1 1 auto' }}>{s.label}</span>
                <span style={{ color: '#888', fontSize: 11 }}>
                  {s.fieldCount}F · {s.imageCount}I · {s.ctaCount}C
                </span>
                {s.hidden ? (
                  <span style={chipStyle('#fbbf24', '#1c1407')}>hidden</span>
                ) : null}
                {s.isDuplicate ? (
                  <span style={chipStyle('#7dd3fc', '#0b1f2a')}>copy</span>
                ) : null}
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {report.forms.length > 0 ? (
        <div style={sectionGroupStyle}>
          <div style={groupHeaderStyle}>Forms</div>
          {report.forms.map((f, i) => (
            <div key={`${f.sectionKey}-${i}`} style={{ fontSize: 11, padding: '2px 0' }}>
              📝 {f.sectionKey} → form #{f.formId ?? '(unset)'}
            </div>
          ))}
        </div>
      ) : null}

      {report.warnings.length > 0 ? (
        <div style={sectionGroupStyle}>
          <div style={groupHeaderStyle}>Warnings ({report.warnings.length})</div>
          {visibleWarnings.map((w, i) => (
            <div key={`${w.code}-${i}`} style={warningRowStyle}>
              <span style={{ color: w.severity === 'block' ? '#f87171' : '#fbbf24' }}>
                {w.severity === 'block' ? '🚫' : '⚠'}
              </span>
              <span style={codeStyle}>{w.code}</span>
              <span style={{ color: '#ccc' }}>{w.message}</span>
              {w.path ? <span style={pathSuffixStyle}>{w.path}</span> : null}
            </div>
          ))}
          {extraWarnings > 0 ? (
            <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
              + {extraWarnings} more
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={actionsRowStyle}>
        {report.nextActions.map((action, i) => {
          if (action.kind === 'rerun_upload') {
            return (
              <button
                key={`${action.kind}-${i}`}
                type="button"
                style={ghostActionStyle}
                onClick={onRerun}
              >
                {action.label}
              </button>
            );
          }
          const style =
            action.kind === 'open_visual_editor' ? primaryActionStyle : secondaryActionStyle;
          return (
            <a
              key={`${action.kind}-${i}`}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              style={style}
            >
              {action.label} ↗
            </a>
          );
        })}
      </div>

      {report.hasCustomHtmlFallback ? (
        <div style={fallbackNoteStyle}>
          Conversion fell back to raw HTML for this page. The visual editor won&apos;t have
          inline-edit support until the page is registered with a content/registry pair under
          src/app/(site)/&lt;name&gt;/.
        </div>
      ) : null}
    </div>
  );
}
