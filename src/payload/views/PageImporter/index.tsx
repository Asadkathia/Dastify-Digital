'use client';

import { useMemo, useState } from 'react';
import type { AIProvider, ImportResponse } from '@/lib/import-agent/types';
import { MODEL_OPTIONS_BY_PROVIDER, resolveModel } from '@/lib/ai/default-models';
import { isReservedPageSlug, normalizeSlug, reservedSlugsList, suggestImportSlug } from '@/lib/import-agent/reserved-slugs';

type FormState = {
  url: string;
  html: string;
  slug: string;
  title: string;
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl: string;
};

const initialForm: FormState = {
  url: '',
  html: '',
  slug: '',
  title: '',
  provider: 'openai',
  model: resolveModel('openai'),
  apiKey: '',
  baseUrl: '',
};

export default function PageImporterView() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedSlug, setSuggestedSlug] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);

  const needsBaseUrl = useMemo(() => form.provider === 'openrouter' || form.provider === 'ollama', [form.provider]);
  const modelOptions = useMemo(() => {
    const options = MODEL_OPTIONS_BY_PROVIDER[form.provider] ?? [];
    if (!form.model || options.includes(form.model)) return options;
    return [form.model, ...options];
  }, [form.provider, form.model]);

  async function fetchHtmlFromUrl() {
    if (!form.url) return;
    setError(null);
    setRaw(null);
    setLoading(true);
    try {
      const res = await fetch(form.url);
      if (!res.ok) throw new Error(`Failed to fetch URL (${res.status})`);
      const html = await res.text();
      setForm((prev) => ({ ...prev, html }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not fetch URL');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setSuggestedSlug(null);
    setRaw(null);
    setResult(null);

    if (!form.html || !form.slug || !form.title) {
      setError('HTML, slug, and title are required.');
      return;
    }

    const normalizedSlug = normalizeSlug(form.slug);
    if (!normalizedSlug) {
      setError('Slug cannot be empty.');
      return;
    }
    if (isReservedPageSlug(normalizedSlug)) {
      const suggested = suggestImportSlug(normalizedSlug);
      setSuggestedSlug(suggested);
      setError(`Slug "${normalizedSlug}" is reserved. Try another. Reserved: ${reservedSlugsList().join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/import-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: form.html,
          slug: normalizedSlug,
          title: form.title,
          ai: {
            provider: form.provider,
            model: form.model,
            apiKey: form.apiKey || undefined,
            baseUrl: form.baseUrl || undefined,
          },
        }),
      });

      const json = (await res.json()) as ImportResponse;
      setResult(json);
      if (!json.ok) {
        setError(json.error || 'Import failed');
        setSuggestedSlug(json.suggestedSlug ?? null);
        if (json.rawAiResponse) setRaw(json.rawAiResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  }

  const report = result?.report;

  return (
    <div style={{ padding: 24, color: '#ddd', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ marginTop: 0, fontSize: 24 }}>Page Importer</h1>
      <p style={{ marginTop: 0, color: '#888', maxWidth: 900 }}>
        Paste HTML (or fetch from URL), choose your AI provider/model, and import as a draft Payload page.
        Unmapped sections are preserved as <code>custom-html-block</code>.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <section style={panelStyle}>
          <h2 style={panelTitle}>Source</h2>

          <label style={labelStyle}>URL (optional)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={form.url}
              onChange={(ev) => setForm((p) => ({ ...p, url: ev.target.value }))}
              placeholder="https://example.com/page"
              style={inputStyle}
            />
            <button type="button" onClick={fetchHtmlFromUrl} disabled={loading || !form.url} style={buttonStyle}>
              Fetch
            </button>
          </div>

          <label style={labelStyle}>HTML</label>
          <textarea
            value={form.html}
            onChange={(ev) => setForm((p) => ({ ...p, html: ev.target.value }))}
            rows={18}
            placeholder="Paste HTML here..."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Page title</label>
              <input
                value={form.title}
                onChange={(ev) => setForm((p) => ({ ...p, title: ev.target.value }))}
                placeholder="About"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input
                value={form.slug}
                onChange={(ev) => setForm((p) => ({ ...p, slug: ev.target.value }))}
                placeholder="about"
                style={inputStyle}
              />
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#666' }}>
                Reserved slugs: {reservedSlugsList().join(', ')}
              </p>
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={panelTitle}>AI Configuration</h2>

          <label style={labelStyle}>Provider</label>
          <select
            value={form.provider}
            onChange={(ev) => {
              const provider = ev.target.value as AIProvider;
              setForm((p) => ({
                ...p,
                provider,
                model: resolveModel(provider),
              }));
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
            list={`model-options-${form.provider}`}
            placeholder="Type or select model ID"
            style={inputStyle}
          />
          <datalist id={`model-options-${form.provider}`}>
            {modelOptions.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>

          <label style={labelStyle}>API key (optional if env is set)</label>
          <input
            value={form.apiKey}
            onChange={(ev) => setForm((p) => ({ ...p, apiKey: ev.target.value }))}
            placeholder="sk-..."
            style={inputStyle}
            type="password"
          />

          {needsBaseUrl ? (
            <>
              <label style={labelStyle}>Base URL</label>
              <input
                value={form.baseUrl}
                onChange={(ev) => setForm((p) => ({ ...p, baseUrl: ev.target.value }))}
                placeholder={form.provider === 'ollama' ? 'http://localhost:11434' : 'https://openrouter.ai/api/v1'}
                style={inputStyle}
              />
            </>
          ) : null}

          <button type="submit" disabled={loading} style={{ ...buttonStyle, width: '100%', marginTop: 12 }}>
            {loading ? 'Importing...' : 'Import Page as Draft'}
          </button>

          {error ? <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p> : null}
          {suggestedSlug ? (
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#888' }}>Suggested:</span>
              <code style={{ fontSize: 12, color: '#93c5fd' }}>{suggestedSlug}</code>
              <button
                type="button"
                style={{ ...buttonStyle, padding: '5px 10px', fontSize: 12 }}
                onClick={() => setForm((p) => ({ ...p, slug: suggestedSlug }))}
              >
                Use
              </button>
            </div>
          ) : null}

          {result?.ok && report ? (
            <div style={{ marginTop: 14, padding: 10, border: '1px solid #163b28', borderRadius: 8, background: '#0b1e16' }}>
              <p style={{ margin: '0 0 8px', color: '#86efac', fontWeight: 600 }}>Import complete</p>
              <p style={metaLine}>Sections: {report.mappedSections}/{report.totalSections} mapped</p>
              <p style={metaLine}>Fallback sections: {report.fallbackSections}</p>
              <p style={metaLine}>Warnings: {report.warnings.length}</p>
              <a href={`/admin/collections/pages/${result.pageId}`} style={{ color: '#60a5fa', fontSize: 13 }}>
                Open Draft Page
              </a>
            </div>
          ) : null}

          {raw ? (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', color: '#888' }}>Raw AI response</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, lineHeight: 1.45, color: '#aaa', marginTop: 8 }}>{raw}</pre>
            </details>
          ) : null}
        </section>
      </form>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  border: '1px solid #242424',
  borderRadius: 10,
  background: '#111',
  padding: 14,
};

const panelTitle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 14,
  color: '#aaa',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#888',
  marginBottom: 6,
  marginTop: 10,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #2e2e2e',
  background: '#0b0b0b',
  color: '#ddd',
  borderRadius: 8,
  padding: '9px 10px',
};

const buttonStyle: React.CSSProperties = {
  border: '1px solid #1d4ed8',
  background: '#1e40af',
  color: '#dbeafe',
  borderRadius: 8,
  padding: '9px 12px',
  cursor: 'pointer',
  fontWeight: 600,
};

const metaLine: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: 13,
  color: '#9ca3af',
};
