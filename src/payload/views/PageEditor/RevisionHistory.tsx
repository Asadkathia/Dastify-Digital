'use client';

import { useEffect, useState } from 'react';
import { useEditorStore, deserializeSectionsFromPayload } from './store';
import {
  buildConvertedBlockDefinition,
  convertedPageContentToSections,
  extractSectionInstances,
  extractDeletedSections,
} from '@/lib/converted-pages/editor-adapter';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { extractSectionOverrides } from '@/lib/converted-pages/section-overrides';
import {
  registerRuntimeBlockDefinitions,
  clearRuntimeBlockDefinitions,
} from './block-registry';
import type { BlockDefinition } from './types';

type Version = {
  id: string;
  updatedAt: string;
  autosave?: boolean;
  version: {
    _status?: string;
    blocks?: Record<string, unknown>[];
    convertedContent?: Record<string, unknown> | null;
  };
};

type ConvertedSectionSpec = {
  key: string;
  label: string;
  icon?: string;
  fieldLabels?: Record<string, string>;
  fieldGroups?: Record<string, import('@/lib/converted-pages/field-labels').FieldGroup>;
};

type ConvertedContentResponse = {
  page: string;
  sections: ConvertedSectionSpec[];
  content: Record<string, unknown>;
};

type RevisionHistoryProps = {
  pageId: string;
  onClose: () => void;
  setConvertedBaseContent?: (content: Record<string, unknown> | null) => void;
};

export function RevisionHistory({ pageId, onClose, setConvertedBaseContent }: RevisionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const setSections = useEditorStore((s) => s.setSections);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const setSectionStyleOverrides = useEditorStore((s) => s.setSectionStyleOverrides);
  const setConvertedSectionMeta = useEditorStore((s) => s.setConvertedSectionMeta);
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);

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
      .catch((err) => {
        console.error('[RevisionHistory] failed to load versions:', err);
      })
      .finally(() => setLoading(false));
  }, [pageId]);

  async function restoreVersion(versionId: string) {
    setRestoring(versionId);
    try {
      const res = await fetch(`/api/pages/versions/${versionId}`, { credentials: 'include' });
      if (!res.ok) return;
      const data: { version?: Version['version'] } = await res.json();
      const version = data.version;
      if (!version) return;

      const convertedContent =
        version.convertedContent && typeof version.convertedContent === 'object'
          ? (version.convertedContent as Record<string, unknown>)
          : null;
      const blocks = version.blocks;
      const isConvertedVersion =
        convertedContent !== null ||
        (editorMode === 'converted' && (!Array.isArray(blocks) || blocks.length === 0));

      if (isConvertedVersion && convertedPageName) {
        const convertedRes = await fetch(
          `/api/admin/converted-page-content?page=${encodeURIComponent(convertedPageName)}`,
          { credentials: 'include' },
        );
        if (!convertedRes.ok) return;
        const payload = (await convertedRes.json()) as ConvertedContentResponse;

        const effectiveContent = convertedContent
          ? mergeConvertedContent(payload.content, convertedContent, convertedPageName)
          : payload.content;
        const nextSections = convertedPageContentToSections(
          convertedPageName,
          effectiveContent,
          payload.sections,
        );

        clearRuntimeBlockDefinitions(`cp-${convertedPageName}-`);
        const specByKey = new Map(payload.sections.map((spec) => [spec.key, spec]));
        const runtimeDefinitions: Record<string, BlockDefinition> = {};
        for (const section of nextSections) {
          for (const column of section.columns) {
            for (const block of column.blocks) {
              const keyPart = block.blockType.replace(`cp-${convertedPageName}-`, '');
              const spec = specByKey.get(keyPart);
              runtimeDefinitions[block.blockType] = buildConvertedBlockDefinition(
                block.blockType,
                spec?.label ?? section.label ?? keyPart,
                spec?.icon ?? '🧩',
                block.data as Record<string, unknown>,
                spec ? { fieldLabels: spec.fieldLabels, fieldGroups: spec.fieldGroups } : undefined,
              );
            }
          }
        }
        registerRuntimeBlockDefinitions(runtimeDefinitions);

        setSections(nextSections);
        setConvertedBaseContent?.(effectiveContent);
        setSectionStyleOverrides(extractSectionOverrides(effectiveContent));
        setConvertedSectionMeta({
          order: nextSections
            .map((s) => String(s.columns[0]?.blocks[0]?.data.__sectionKey ?? ''))
            .filter(Boolean),
          instances: extractSectionInstances(effectiveContent),
          deleted: extractDeletedSections(effectiveContent),
          registryOrder: payload.sections.map((spec) => spec.key),
        });
        setSaveStatus('dirty');
        onClose();
        return;
      }

      if (Array.isArray(blocks)) {
        setSections(deserializeSectionsFromPayload(blocks));
        setSaveStatus('dirty');
        onClose();
      }
    } catch (err) {
      console.error('[RevisionHistory] failed to restore version:', err);
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
