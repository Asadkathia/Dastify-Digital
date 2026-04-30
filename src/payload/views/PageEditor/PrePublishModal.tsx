'use client';

import { useEffect } from 'react';
import type { ValidationIssue } from '@/lib/converted-pages/validate-publish';

type PrePublishModalProps = {
  blocks: ValidationIssue[];
  warnings: ValidationIssue[];
  onCancel: () => void;
  onPublishAnyway?: () => void;
};

export function PrePublishModal({
  blocks,
  warnings,
  onCancel,
  onPublishAnyway,
}: PrePublishModalProps) {
  const hasBlocks = blocks.length > 0;
  const showPublishAnyway = !hasBlocks && warnings.length > 0 && Boolean(onPublishAnyway);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative',
          width: 'min(560px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 80px)',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 18px',
            borderBottom: '1px solid #222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: hasBlocks ? '#f87171' : '#fbbf24',
            }}
          >
            {hasBlocks ? '❌ Cannot publish' : '⚠ Review before publishing'}
          </p>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px 4px',
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {hasBlocks && (
            <IssueGroup
              title="Critical issues"
              tone="#f87171"
              toneBg="rgba(248,113,113,0.08)"
              issues={blocks}
            />
          )}
          {warnings.length > 0 && (
            <IssueGroup
              title="Warnings"
              tone="#fbbf24"
              toneBg="rgba(251,191,36,0.08)"
              issues={warnings}
            />
          )}
        </div>

        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #222',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: '1px solid #222',
              borderRadius: '6px',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
            }}
          >
            Cancel
          </button>
          {showPublishAnyway && (
            <button
              onClick={onPublishAnyway}
              style={{
                background: '#78350f',
                border: '1px solid #fbbf24',
                borderRadius: '6px',
                color: '#fde68a',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 14px',
              }}
            >
              Publish anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type IssueGroupProps = {
  title: string;
  tone: string;
  toneBg: string;
  issues: ValidationIssue[];
};

function IssueGroup({ title, tone, toneBg, issues }: IssueGroupProps) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <p
        style={{
          margin: '0 0 8px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: tone,
        }}
      >
        {title} ({issues.length})
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {issues.map((issue, i) => {
          const detail = issue.path ?? issue.sectionKey ?? '';
          return (
            <li
              key={`${issue.code}-${i}`}
              style={{
                background: toneBg,
                border: `1px solid ${tone}33`,
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '12px',
                color: '#ddd',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: tone, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '10px' }}>
                  {issue.code}
                </span>
                <span>{issue.message}</span>
              </div>
              {detail && (
                <span style={{ color: '#666', fontSize: '11px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  {detail}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
