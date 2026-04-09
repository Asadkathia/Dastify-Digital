'use client';

import { useState, useMemo } from 'react';
import type { AIProvider } from '@/lib/import-agent/types';
import { resolveModel } from '@/lib/ai/default-models';
import type { ConvertPageResult, ConvertedFile } from '@/lib/page-converter/types';

type FormState = {
  html: string;
  pageName: string;
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl: string;
};

const initialForm: FormState = {
  html: '',
  pageName: '',
  provider: 'openai',
  model: resolveModel('openai'),
  apiKey: '',
  baseUrl: '',
};

export default function PageConverterView() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [result, setResult] = useState<(ConvertPageResult & { ok: true }) | null>(null);
  const [written, setWritten] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ConvertedFile | null>(null);

  const needsBaseUrl = useMemo(
    () => form.provider === 'openrouter' || form.provider === 'ollama',
    [form.provider],
  );

  async function onConvert(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRaw(null);
    setResult(null);
    setWritten(false);
    setSelectedFile(null);

    if (!form.html.trim() || !form.pageName.trim()) {
      setError('HTML and page name are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/convert-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: form.html,
          pageName: form.pageName,
          writeFiles: false, // preview first
          ai: {
            provider: form.provider,
            model: form.model,
            apiKey: form.apiKey || undefined,
            baseUrl: form.baseUrl || undefined,
          },
        }),
      });

      const json = (await res.json()) as ConvertPageResult;

      if (!json.ok) {
        setError((json as { ok: false; error: string }).error || 'Conversion failed');
        if ('rawAiResponse' in json && json.rawAiResponse) setRaw(json.rawAiResponse);
        return;
      }

      const success = json as ConvertPageResult & { ok: true };
      setResult(success);
      if (success.files.length > 0) setSelectedFile(success.files[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  async function onWriteFiles() {
    if (!result) return;
    setWriting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/convert-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: form.html,
          pageName: result.pageName,
          writeFiles: true,
          ai: {
            provider: form.provider,
            model: form.model,
            apiKey: form.apiKey || undefined,
            baseUrl: form.baseUrl || undefined,
          },
        }),
      });
      const json = (await res.json()) as ConvertPageResult;
      if (!json.ok) {
        setError((json as { ok: false; error: string }).error || 'Write failed');
      } else {
        setWritten(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Write failed');
    } finally {
      setWriting(false);
    }
  }

  return (
    <div style={{ padding: 24, color: '#ddd', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <h1 style={{ marginTop: 0, fontSize: 22, marginBottom: 4 }}>Page Converter</h1>
      <p style={{ margin: '0 0 20px', color: '#888', fontSize: 13, maxWidth: 800 }}>
        Converts raw HTML into pixel-perfect Next.js TSX components — same pattern as the homepage.
        Preview the generated files before writing them to disk.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.6fr' : '2fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* ── Left: form ── */}
        <form onSubmit={onConvert} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <section style={panelStyle}>
            <h2 style={panelTitle}>Source HTML</h2>

            <label style={labelStyle}>Page name (used as route slug)</label>
            <input
              value={form.pageName}
              onChange={(ev) => setForm((p) => ({ ...p, pageName: ev.target.value }))}
              placeholder="services"
              style={inputStyle}
            />
            <p style={{ margin: '4px 0 10px', fontSize: 11, color: '#555' }}>
              Creates <code style={{ color: '#93c5fd' }}>src/app/(site)/{'{pageName}'}/page.tsx</code>
            </p>

            <label style={labelStyle}>HTML</label>
            <textarea
              value={form.html}
              onChange={(ev) => setForm((p) => ({ ...p, html: ev.target.value }))}
              rows={20}
              placeholder="Paste full HTML here..."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'ui-monospace, monospace', fontSize: 11, lineHeight: 1.5 }}
            />
          </section>

          <section style={{ ...panelStyle, marginTop: 12 }}>
            <h2 style={panelTitle}>AI Configuration</h2>

            <label style={labelStyle}>Provider</label>
            <select
              value={form.provider}
              onChange={(ev) => {
                const provider = ev.target.value as AIProvider;
                setForm((p) => ({ ...p, provider, model: resolveModel(provider) }));
              }}
              style={inputStyle}
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="openrouter">OpenRouter</option>
              <option value="ollama">Ollama</option>
            </select>

            <label style={labelStyle}>Model</label>
            <input
              value={form.model}
              onChange={(ev) => setForm((p) => ({ ...p, model: ev.target.value }))}
              style={inputStyle}
            />

            <label style={labelStyle}>API key (optional if env var set)</label>
            <input
              value={form.apiKey}
              onChange={(ev) => setForm((p) => ({ ...p, apiKey: ev.target.value }))}
              placeholder="sk-..."
              type="password"
              style={inputStyle}
            />

            {needsBaseUrl && (
              <>
                <label style={labelStyle}>Base URL</label>
                <input
                  value={form.baseUrl}
                  onChange={(ev) => setForm((p) => ({ ...p, baseUrl: ev.target.value }))}
                  placeholder={form.provider === 'ollama' ? 'http://localhost:11434' : 'https://openrouter.ai/api/v1'}
                  style={inputStyle}
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...btnStyle, width: '100%', marginTop: 14, fontSize: 13, padding: '11px 0' }}
            >
              {loading ? '⟳ Converting...' : '✦ Convert to TSX'}
            </button>

            {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{error}</p>}

            {raw && (
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: 'pointer', color: '#666', fontSize: 12 }}>Raw AI response</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10, color: '#888', marginTop: 6 }}>{raw}</pre>
              </details>
            )}
          </section>
        </form>

        {/* ── Right: file preview ── */}
        {result && (
          <section style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, color: '#86efac', fontWeight: 600 }}>
                  ✓ {result.files.length} files generated
                </span>
                <span style={{ fontSize: 12, color: '#555', marginLeft: 12 }}>
                  /{result.pageName}/
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {written ? (
                  <span style={{ fontSize: 12, color: '#86efac', padding: '7px 14px' }}>
                    ✓ Written to disk
                  </span>
                ) : (
                  <button
                    onClick={onWriteFiles}
                    disabled={writing}
                    style={{ ...btnStyle, background: '#166534', borderColor: '#16a34a', fontSize: 12 }}
                  >
                    {writing ? 'Writing...' : '↓ Write to disk'}
                  </button>
                )}
              </div>
            </div>

            {written && (
              <div style={{ padding: '10px 16px', background: '#0a1f12', borderBottom: '1px solid #1f1f1f', fontSize: 12, color: '#86efac' }}>
                Files written. Run <code style={{ background: '#0f2b18', padding: '2px 6px', borderRadius: 4 }}>npm run dev</code> and visit{' '}
                <code style={{ background: '#0f2b18', padding: '2px 6px', borderRadius: 4 }}>/{result.pageName}</code> to preview.
                {result.cssAdditions.trim() && (
                  <> CSS additions appended to <code style={{ background: '#0f2b18', padding: '2px 6px', borderRadius: 4 }}>globals.css</code>.</>
                )}
              </div>
            )}

            {/* File tabs */}
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}>
              {result.files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  style={{
                    background: selectedFile?.path === file.path ? '#111' : 'transparent',
                    border: 'none',
                    borderBottom: selectedFile?.path === file.path ? '2px solid #3b82f6' : '2px solid transparent',
                    color: selectedFile?.path === file.path ? '#ddd' : '#555',
                    padding: '8px 14px',
                    fontSize: 11,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {file.path.split('/').pop()}
                </button>
              ))}
              {result.cssAdditions.trim() && (
                <button
                  onClick={() =>
                    setSelectedFile({ path: 'globals.css additions', code: result.cssAdditions })
                  }
                  style={{
                    background: selectedFile?.path === 'globals.css additions' ? '#111' : 'transparent',
                    border: 'none',
                    borderBottom: selectedFile?.path === 'globals.css additions' ? '2px solid #a78bfa' : '2px solid transparent',
                    color: selectedFile?.path === 'globals.css additions' ? '#a78bfa' : '#555',
                    padding: '8px 14px',
                    fontSize: 11,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  globals.css +
                </button>
              )}
            </div>

            {/* Code viewer */}
            {selectedFile && (
              <div style={{ position: 'relative' }}>
                <div style={{ padding: '6px 16px 4px', background: '#080808', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace' }}>
                    src/{selectedFile.path}
                  </span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '16px',
                    background: '#0a0a0a',
                    color: '#e2e8f0',
                    fontSize: 11,
                    lineHeight: 1.6,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    overflowX: 'auto',
                    maxHeight: '65vh',
                    overflowY: 'auto',
                    whiteSpace: 'pre',
                  }}
                >
                  {selectedFile.code}
                </pre>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  border: '1px solid #1e1e1e',
  borderRadius: 10,
  background: '#0f0f0f',
  padding: 16,
};

const panelTitle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 11,
  color: '#555',
  textTransform: 'uppercase',
  letterSpacing: '0.10em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#777',
  marginBottom: 5,
  marginTop: 12,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #222',
  background: '#060606',
  color: '#ddd',
  borderRadius: 6,
  padding: '8px 10px',
  fontSize: 13,
};

const btnStyle: React.CSSProperties = {
  border: '1px solid #1d4ed8',
  background: '#1e3a8a',
  color: '#bfdbfe',
  borderRadius: 6,
  padding: '8px 14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 12,
};
