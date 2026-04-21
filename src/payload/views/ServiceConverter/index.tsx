'use client';

import '../../admin.css';
import { useMemo, useState } from 'react';
import type { AIProvider } from '@/lib/import-agent/types';
import { MODEL_OPTIONS_BY_PROVIDER, resolveModel } from '@/lib/ai/default-models';
import type { ServicePreview } from '@/lib/content-converters/service/schema';
import { adminStyles, Button, Panel, FormField, StatusMessage } from '../_shared';

type Step = 'source' | 'preview';

export default function ServiceConverterView() {
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
  const [preview, setPreview] = useState<ServicePreview | null>(null);
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
      const res = await fetch('/api/admin/convert-service', {
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
      const data = (await res.json()) as { ok?: boolean; error?: string; warnings?: string[]; data?: ServicePreview };
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
      const res = await fetch('/api/admin/convert-service', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          title: preview.title,
          slug: preview.slug,
          tagline: preview.tagline,
          excerpt: preview.excerpt,
          outcomesTitle: preview.outcomesTitle,
          outcomes: preview.outcomes,
          cta: preview.cta,
          bodyLexical: preview.bodyLexical,
          heroImageId: preview.heroImageId,
          displayOrder: preview.displayOrder,
          blocks: preview.blocks ?? [],
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; adminUrl?: string; existingId?: number };
      if (!res.ok || !data.ok) {
        const extra = data.existingId ? ` — open existing: /admin/collections/services/${data.existingId}` : '';
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
      <div data-admin-view="service-converter" style={adminStyles.container}>
        <h1 style={adminStyles.heading1}>Convert Service</h1>
        <p style={{ margin: '8px 0 var(--admin-space-6)', color: 'var(--admin-text-tertiary)', fontSize: 'var(--admin-text-md)' }}>
          Paste a service page&apos;s HTML (or enter a URL), extract the fields with AI, then upload as a draft in the Services collection.
        </p>

        {error && <div style={{ marginBottom: 'var(--admin-space-4)' }}><StatusMessage tone="error">{error}</StatusMessage></div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--admin-space-4)' }}>
          <Panel title="Source">
            <FormField label="URL (optional)">
              <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/services/healthcare-seo"
                  style={{ ...adminStyles.input, flex: 1 }}
                />
                <Button type="button" onClick={fetchHtml} disabled={!url || fetching} loading={fetching}>
                  {fetching ? 'Fetching…' : 'Fetch'}
                </Button>
              </div>
            </FormField>

            <FormField label="HTML" help="Paste the service page HTML. The AI extracts title, tagline, outcomes, CTA, and body content.">
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={18}
                placeholder="<section>...</section>"
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
    <div data-admin-view="service-converter" style={adminStyles.container}>
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

          <FormField label="Slug" help="Lowercase letters, numbers, hyphens. URL will be /services/<slug>.">
            <input value={preview.slug} onChange={(e) => setPreview({ ...preview, slug: e.target.value })} style={adminStyles.input} />
          </FormField>

          <FormField label="Tagline" help="One-line summary shown in the accordion row header.">
            <input value={preview.tagline} onChange={(e) => setPreview({ ...preview, tagline: e.target.value })} style={adminStyles.input} />
          </FormField>

          <FormField label="Excerpt">
            <textarea
              value={preview.excerpt}
              onChange={(e) => setPreview({ ...preview, excerpt: e.target.value })}
              rows={3}
              style={{ ...adminStyles.input, resize: 'vertical' }}
            />
          </FormField>

          <FormField label="Display order" help="Lower numbers appear first in the services accordion.">
            <input
              type="number"
              value={preview.displayOrder}
              onChange={(e) => setPreview({ ...preview, displayOrder: Number(e.target.value) })}
              style={{ ...adminStyles.input, width: 100 }}
            />
          </FormField>

          <FormField label="Full page layout" help="When present, the service detail page renders these blocks pixel-perfect instead of the default layout.">
            {preview.blocks && preview.blocks.length > 0 ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-success-text)' }}>
                ✓ {preview.blocks.length} block{preview.blocks.length === 1 ? '' : 's'} generated from HTML. Edit later in the Service admin&apos;s &ldquo;Blocks&rdquo; field.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-warning-text)' }}>
                No blocks generated. The detail page will use the default layout.
              </div>
            )}
          </FormField>

          <FormField label="Hero image">
            {preview.heroImageId ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-success-text)' }}>
                ✓ Uploaded to Media collection (id: {preview.heroImageId})
              </div>
            ) : preview.heroImageSourceUrl ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-warning-text)' }}>
                Download failed. URL: <code>{preview.heroImageSourceUrl}</code>. Upload manually after import.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-tertiary)' }}>No image detected.</div>
            )}
          </FormField>

          <FormField label="Body (preview)" help="Rendered preview of extracted content. Edit rich text after import in the Services editor.">
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
          <Panel title="Outcomes">
            <p style={adminStyles.helpText}>Deliverables / results bullets shown in the expanded accordion panel.</p>
            <FormField label="Section heading">
              <input
                value={preview.outcomesTitle}
                onChange={(e) => setPreview({ ...preview, outcomesTitle: e.target.value })}
                style={adminStyles.input}
              />
            </FormField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {preview.outcomes.map((outcome, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                  <input
                    value={outcome}
                    onChange={(e) => {
                      const next = [...preview.outcomes];
                      next[i] = e.target.value;
                      setPreview({ ...preview, outcomes: next });
                    }}
                    style={{ ...adminStyles.input, flex: 1 }}
                  />
                  <Button
                    type="button"
                    onClick={() => setPreview({ ...preview, outcomes: preview.outcomes.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => setPreview({ ...preview, outcomes: [...preview.outcomes, ''] })}
                style={{ marginTop: 4 }}
              >
                + Add outcome
              </Button>
            </div>
          </Panel>

          <Panel title="CTA">
            <FormField label="Button label">
              <input
                value={preview.cta.label}
                onChange={(e) => setPreview({ ...preview, cta: { ...preview.cta, label: e.target.value } })}
                style={adminStyles.input}
              />
            </FormField>
            <FormField label="Link (href)">
              <input
                value={preview.cta.href}
                onChange={(e) => setPreview({ ...preview, cta: { ...preview.cta, href: e.target.value } })}
                placeholder="/contact"
                style={adminStyles.input}
              />
            </FormField>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 'var(--admin-space-5)', display: 'flex', gap: 'var(--admin-space-3)' }}>
        <Button variant="primary" size="md" onClick={commit} disabled={committing || !!successAdminUrl} loading={committing}>
          {committing ? 'Creating draft…' : successAdminUrl ? 'Done' : 'Upload to Services →'}
        </Button>
      </div>
    </div>
  );
}
