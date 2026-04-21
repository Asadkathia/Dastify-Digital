'use client';

import '../../admin.css';
import { useMemo, useState } from 'react';
import type { AIProvider } from '@/lib/import-agent/types';
import { MODEL_OPTIONS_BY_PROVIDER, resolveModel } from '@/lib/ai/default-models';
import type { CaseStudyPreview } from '@/lib/content-converters/case-study/schema';
import { adminStyles, Button, Panel, FormField, StatusMessage } from '../_shared';

type Step = 'source' | 'preview';

export default function CaseStudyConverterView() {
  const [step, setStep] = useState<Step>('source');

  // ─── Source form state ────────────────────────────────────────────────
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [model, setModel] = useState<string>(resolveModel('anthropic'));
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  const [extracting, setExtracting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  // ─── Preview state ────────────────────────────────────────────────────
  const [preview, setPreview] = useState<CaseStudyPreview | null>(null);
  const [committing, setCommitting] = useState(false);
  const [successAdminUrl, setSuccessAdminUrl] = useState<string | null>(null);

  const needsBaseUrl = useMemo(() => provider === 'openrouter' || provider === 'ollama', [provider]);
  const modelOptions = useMemo(() => {
    const options = MODEL_OPTIONS_BY_PROVIDER[provider] ?? [];
    if (!model || options.includes(model)) return options;
    return [model, ...options];
  }, [provider, model]);

  async function fetchHtml() {
    if (!url) return;
    setError(null);
    setFetching(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch URL (${res.status})`);
      setHtml(await res.text());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not fetch URL');
    } finally {
      setFetching(false);
    }
  }

  async function extract() {
    setError(null);
    setWarnings([]);
    setExtracting(true);
    try {
      const res = await fetch('/api/admin/convert-case-study', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extract',
          html,
          url: url || undefined,
          provider,
          model,
          apiKey: apiKey || undefined,
          baseUrl: baseUrl || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; warnings?: string[]; data?: CaseStudyPreview };
      if (!res.ok || !data.ok || !data.data) {
        throw new Error(data.error || `Extraction failed (${res.status})`);
      }
      setPreview(data.data);
      setWarnings(data.warnings ?? []);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed.');
    } finally {
      setExtracting(false);
    }
  }

  async function commit() {
    if (!preview) return;
    setError(null);
    setCommitting(true);
    try {
      const res = await fetch('/api/admin/convert-case-study', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          title: preview.title,
          slug: preview.slug,
          client: preview.client,
          excerpt: preview.excerpt,
          filterTag: preview.filterTag,
          stats: preview.stats,
          bodyLexical: preview.bodyLexical,
          featuredImageId: preview.featuredImageId,
          featured: preview.featured,
          blocks: preview.blocks ?? [],
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; adminUrl?: string; existingId?: number };
      if (!res.ok || !data.ok) {
        const extra = data.existingId ? ` — open existing: /admin/collections/case-studies/${data.existingId}` : '';
        throw new Error((data.error || `Commit failed (${res.status})`) + extra);
      }
      setSuccessAdminUrl(data.adminUrl ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Commit failed.');
    } finally {
      setCommitting(false);
    }
  }

  // ─── Source step ─────────────────────────────────────────────────────
  if (step === 'source') {
    return (
      <div data-admin-view="case-study-converter" style={adminStyles.container}>
        <h1 style={adminStyles.heading1}>Convert Case Study</h1>
        <p style={{ margin: '8px 0 var(--admin-space-6)', color: 'var(--admin-text-tertiary)', fontSize: 'var(--admin-text-md)' }}>
          Paste a case study page&apos;s HTML (or enter a URL), extract the fields with AI, then upload as a draft in the Case Studies collection.
        </p>

        {error && <div style={{ marginBottom: 'var(--admin-space-4)' }}><StatusMessage tone="error">{error}</StatusMessage></div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--admin-space-4)' }}>
          <Panel title="Source">
            <FormField label="URL (optional)">
              <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/case-studies/dental-practice"
                  style={{ ...adminStyles.input, flex: 1 }}
                />
                <Button type="button" onClick={fetchHtml} disabled={!url || fetching} loading={fetching}>
                  {fetching ? 'Fetching…' : 'Fetch'}
                </Button>
              </div>
            </FormField>

            <FormField label="HTML" help="Paste the case study page HTML. The AI extracts client, stats, filter tag, and body content.">
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={18}
                placeholder="<article>...</article>"
                style={{ ...adminStyles.input, resize: 'vertical', fontFamily: 'var(--admin-font-mono)', fontSize: 'var(--admin-text-sm)' }}
              />
            </FormField>

            <div style={{ marginTop: 'var(--admin-space-4)' }}>
              <Button type="button" variant="primary" size="md" onClick={extract} disabled={!html || extracting} loading={extracting}>
                {extracting ? 'Extracting with AI…' : 'Extract Fields →'}
              </Button>
            </div>
          </Panel>

          <Panel title="AI Settings">
            <FormField label="Provider">
              <select
                value={provider}
                onChange={(e) => {
                  const next = e.target.value as AIProvider;
                  setProvider(next);
                  setModel(resolveModel(next));
                }}
                style={adminStyles.input}
              >
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI</option>
                <option value="google">Google (Gemini)</option>
                <option value="openrouter">OpenRouter</option>
                <option value="ollama">Ollama (local)</option>
                <option value="claude-code">Claude Code (local binary)</option>
              </select>
            </FormField>

            <FormField label="Model">
              <select value={model} onChange={(e) => setModel(e.target.value)} style={adminStyles.input}>
                {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>

            <FormField label="API key (optional)" help="Leave blank to use the env-var default for the provider.">
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="sk-…"
                style={adminStyles.input}
              />
            </FormField>

            {needsBaseUrl && (
              <FormField label="Base URL">
                <input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder={provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'http://localhost:11434'}
                  style={adminStyles.input}
                />
              </FormField>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  // ─── Preview step ────────────────────────────────────────────────────
  if (!preview) return null;

  return (
    <div data-admin-view="case-study-converter" style={adminStyles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--admin-space-4)' }}>
        <h1 style={adminStyles.heading1}>Review & Upload</h1>
        <Button type="button" onClick={() => { setStep('source'); setPreview(null); setSuccessAdminUrl(null); }}>
          ← Back to source
        </Button>
      </div>

      {successAdminUrl && (
        <div style={{ marginBottom: 'var(--admin-space-4)' }}>
          <StatusMessage tone="success">
            Created as draft.{' '}
            <a href={successAdminUrl} style={{ color: 'var(--admin-accent-text)', textDecoration: 'underline' }}>
              Open in admin →
            </a>
          </StatusMessage>
        </div>
      )}

      {error && <div style={{ marginBottom: 'var(--admin-space-4)' }}><StatusMessage tone="error">{error}</StatusMessage></div>}

      {warnings.length > 0 && (
        <div style={{ marginBottom: 'var(--admin-space-4)' }}>
          <StatusMessage tone="warning">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </StatusMessage>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--admin-space-4)' }}>
        <Panel title="Extracted fields">
          <FormField label="Title">
            <input value={preview.title} onChange={(e) => setPreview({ ...preview, title: e.target.value })} style={adminStyles.input} />
          </FormField>

          <FormField label="Slug" help="Lowercase letters, numbers, hyphens. URL will be /case-studies/<slug>.">
            <input value={preview.slug} onChange={(e) => setPreview({ ...preview, slug: e.target.value })} style={adminStyles.input} />
          </FormField>

          <FormField label="Client / practice name">
            <input
              value={preview.client ?? ''}
              onChange={(e) => setPreview({ ...preview, client: e.target.value || null })}
              placeholder="e.g. Brightside Dental"
              style={adminStyles.input}
            />
          </FormField>

          <FormField label="Excerpt">
            <textarea
              value={preview.excerpt}
              onChange={(e) => setPreview({ ...preview, excerpt: e.target.value })}
              rows={3}
              style={{ ...adminStyles.input, resize: 'vertical' }}
            />
          </FormField>

          <FormField label="Filter tag" help="Lowercase slug for the tabbed category filter (e.g. dental, fertility, urgent-care).">
            <input
              value={preview.filterTag ?? ''}
              onChange={(e) => setPreview({ ...preview, filterTag: e.target.value || null })}
              placeholder="dental"
              style={adminStyles.input}
            />
          </FormField>

          <FormField label="Full page layout" help="When present, the case study detail page renders these blocks pixel-perfect instead of the default layout.">
            {preview.blocks && preview.blocks.length > 0 ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-success-text)' }}>
                ✓ {preview.blocks.length} block{preview.blocks.length === 1 ? '' : 's'} generated from HTML. Edit later in the Case Study admin&apos;s &ldquo;Blocks&rdquo; field.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-warning-text)' }}>
                No blocks generated. The detail page will use the default layout.
              </div>
            )}
          </FormField>

          <FormField label="Featured image">
            {preview.featuredImageId ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-success-text)' }}>
                ✓ Uploaded to Media collection (id: {preview.featuredImageId})
              </div>
            ) : preview.featuredImageSourceUrl ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-warning-text)' }}>
                Download failed. URL: <code>{preview.featuredImageSourceUrl}</code>. Upload manually after import.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-tertiary)' }}>No image detected.</div>
            )}
          </FormField>

          <FormField label="Body (preview)" help="Rendered preview of extracted content. Edit rich text after import in the Case Studies editor.">
            {preview.bodyHtml ? (
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: preview.bodyHtml }}
                style={{
                  ...adminStyles.input,
                  minHeight: 80,
                  maxHeight: 360,
                  overflowY: 'auto',
                  lineHeight: 1.7,
                  fontSize: 'var(--admin-text-md)',
                  color: 'var(--admin-text-primary)',
                }}
              />
            ) : (
              <div style={{ ...adminStyles.input, color: 'var(--admin-text-tertiary)', fontSize: 'var(--admin-text-sm)' }}>
                No body content extracted.
              </div>
            )}
          </FormField>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
          <Panel title="Stats">
            <p style={adminStyles.helpText}>Up to 5 metrics displayed prominently on the card (e.g. "$2.4M", "300% growth").</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {preview.stats.map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px', background: 'var(--admin-surface-1)', borderRadius: 6 }}>
                  <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                    <input
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...preview.stats];
                        next[i] = { ...next[i], value: e.target.value };
                        setPreview({ ...preview, stats: next });
                      }}
                      placeholder="$2.4M"
                      style={{ ...adminStyles.input, flex: 1, fontWeight: 700 }}
                    />
                    <Button
                      type="button"
                      onClick={() => setPreview({ ...preview, stats: preview.stats.filter((_, j) => j !== i) })}
                    >
                      ✕
                    </Button>
                  </div>
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...preview.stats];
                      next[i] = { ...next[i], label: e.target.value };
                      setPreview({ ...preview, stats: next });
                    }}
                    placeholder="New patient revenue"
                    style={adminStyles.input}
                  />
                </div>
              ))}
              {preview.stats.length < 5 && (
                <Button
                  type="button"
                  onClick={() => setPreview({ ...preview, stats: [...preview.stats, { value: '', label: '' }] })}
                >
                  + Add stat
                </Button>
              )}
            </div>
          </Panel>

          <Panel title="Options">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preview.featured}
                onChange={(e) => setPreview({ ...preview, featured: e.target.checked })}
              />
              Featured (occupies large slot in case studies grid)
            </label>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 'var(--admin-space-5)', display: 'flex', gap: 'var(--admin-space-3)' }}>
        <Button variant="primary" size="md" onClick={commit} disabled={committing || !!successAdminUrl} loading={committing}>
          {committing ? 'Creating draft…' : successAdminUrl ? 'Done' : 'Upload to Case Studies →'}
        </Button>
      </div>
    </div>
  );
}
