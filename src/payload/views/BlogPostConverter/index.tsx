'use client';

import '../../admin.css';
import { useEffect, useMemo, useState } from 'react';
import type { AIProvider } from '@/lib/import-agent/types';
import { MODEL_OPTIONS_BY_PROVIDER, resolveModel } from '@/lib/ai/default-models';
import type { BlogPostPreview } from '@/lib/content-converters/blog-post/schema';
import { adminStyles, Button, Panel, FormField, StatusMessage } from '../_shared';

type Step = 'source' | 'preview';

type Category = { id: number; title: string; slug: string };
type Tag = { id: number; title: string; slug: string };

export default function BlogPostConverterView() {
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

  // ─── Preview state (editable before commit) ──────────────────────────
  const [preview, setPreview] = useState<BlogPostPreview | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [createCategoriesCheckboxes, setCreateCategoriesCheckboxes] = useState<Set<string>>(new Set());
  const [createTagsCheckboxes, setCreateTagsCheckboxes] = useState<Set<string>>(new Set());

  const [committing, setCommitting] = useState(false);
  const [successAdminUrl, setSuccessAdminUrl] = useState<string | null>(null);

  const needsBaseUrl = useMemo(() => provider === 'openrouter' || provider === 'ollama', [provider]);
  const modelOptions = useMemo(() => {
    const options = MODEL_OPTIONS_BY_PROVIDER[provider] ?? [];
    if (!model || options.includes(model)) return options;
    return [model, ...options];
  }, [provider, model]);

  // Load category / tag options once for the manual-pick UI (option A from the plan).
  useEffect(() => {
    if (step !== 'preview') return;
    fetch('/api/blog-categories?limit=200&depth=0', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((data) => setAllCategories((data.docs ?? []) as Category[]))
      .catch((err) => console.error('[BlogPostConverter] load categories:', err));
    fetch('/api/tags?limit=200&depth=0', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((data) => setAllTags((data.docs ?? []) as Tag[]))
      .catch((err) => console.error('[BlogPostConverter] load tags:', err));
  }, [step]);

  async function fetchHtml() {
    if (!url) return;
    setError(null);
    setFetching(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch URL (${res.status})`);
      const text = await res.text();
      setHtml(text);
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
      const res = await fetch('/api/admin/convert-blog-post', {
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
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        warnings?: string[];
        data?: BlogPostPreview;
      };
      if (!res.ok || !data.ok || !data.data) {
        throw new Error(data.error || `Extraction failed (${res.status})`);
      }
      setPreview(data.data);
      setSelectedCategoryIds(new Set(data.data.matchedCategoryIds));
      setSelectedTagIds(new Set(data.data.matchedTagIds));
      setCreateCategoriesCheckboxes(new Set());
      setCreateTagsCheckboxes(new Set());
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
      const res = await fetch('/api/admin/convert-blog-post', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          title: preview.title,
          slug: preview.slug,
          excerpt: preview.excerpt,
          publishedAt: preview.publishedAt,
          author: preview.author,
          bodyLexical: preview.bodyLexical,
          featuredImageId: preview.featuredImageId,
          categoryIds: [...selectedCategoryIds],
          categoriesToCreate: [...createCategoriesCheckboxes],
          tagIds: [...selectedTagIds],
          tagsToCreate: [...createTagsCheckboxes],
          blocks: preview.blocks ?? [],
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; adminUrl?: string; existingId?: number };
      if (!res.ok || !data.ok) {
        const extra = data.existingId ? ` — open existing: /admin/collections/blog-posts/${data.existingId}` : '';
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
      <div data-admin-view="blog-post-converter" style={adminStyles.container}>
        <h1 style={adminStyles.heading1}>Convert Blog Post</h1>
        <p style={{ margin: '8px 0 var(--admin-space-6)', color: 'var(--admin-text-tertiary)', fontSize: 'var(--admin-text-md)' }}>
          Paste a blog post&apos;s HTML (or enter a URL), extract the fields with AI, then upload as a draft in the Blog Posts collection.
        </p>

        {error && <div style={{ marginBottom: 'var(--admin-space-4)' }}><StatusMessage tone="error">{error}</StatusMessage></div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--admin-space-4)' }}>
          <Panel title="Source">
            <FormField label="URL (optional)">
              <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/blog/some-post"
                  style={{ ...adminStyles.input, flex: 1 }}
                />
                <Button type="button" onClick={fetchHtml} disabled={!url || fetching} loading={fetching}>
                  {fetching ? 'Fetching…' : 'Fetch'}
                </Button>
              </div>
            </FormField>

            <FormField label="HTML" help="Paste the full article HTML. Supports <h2>–<h4>, <p>, <ul>/<ol>, <a>, <strong>/<em>.">
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
    <div data-admin-view="blog-post-converter" style={adminStyles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--admin-space-4)' }}>
        <h1 style={adminStyles.heading1}>Review & Upload</h1>
        <Button type="button" onClick={() => { setStep('source'); setPreview(null); setSuccessAdminUrl(null); }}>
          ← Back to source
        </Button>
      </div>

      {successAdminUrl ? (
        <div style={{ marginBottom: 'var(--admin-space-4)' }}>
          <StatusMessage tone="success">
            Created as draft. {' '}
            <a href={successAdminUrl} style={{ color: 'var(--admin-accent-text)', textDecoration: 'underline' }}>
              Open in admin →
            </a>
          </StatusMessage>
        </div>
      ) : null}

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
            <input
              value={preview.title}
              onChange={(e) => setPreview({ ...preview, title: e.target.value })}
              style={adminStyles.input}
            />
          </FormField>

          <FormField label="Slug" help="Lowercase letters, numbers, hyphens. URL will be /blog/<slug>.">
            <input
              value={preview.slug}
              onChange={(e) => setPreview({ ...preview, slug: e.target.value })}
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

          <FormField label="Published at" help="ISO 8601 or YYYY-MM-DD. Leave blank to set after import.">
            <input
              value={preview.publishedAt ?? ''}
              onChange={(e) => setPreview({ ...preview, publishedAt: e.target.value || null })}
              placeholder="2026-04-21"
              style={adminStyles.input}
            />
          </FormField>

          <FormField label="Full page layout" help="When present, the blog post detail page renders these blocks pixel-perfect instead of the default layout.">
            {preview.blocks && preview.blocks.length > 0 ? (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-success-text)' }}>
                ✓ {preview.blocks.length} block{preview.blocks.length === 1 ? '' : 's'} generated from HTML. Edit later in the Blog Post admin&apos;s &ldquo;Blocks&rdquo; field.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-warning-text)' }}>
                No blocks generated. The detail page will use the default article layout.
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
                Download failed. Original URL: <code>{preview.featuredImageSourceUrl}</code>. Upload manually in the post editor after import.
              </div>
            ) : (
              <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-tertiary)' }}>
                No featured image detected in the HTML.
              </div>
            )}
          </FormField>

          <FormField label="Body (preview)" help="Rendered preview of extracted content. Edit rich text after import in the Blog Posts editor.">
            {preview.bodyHtml ? (
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: preview.bodyHtml }}
                style={{
                  ...adminStyles.input,
                  minHeight: 120,
                  maxHeight: 480,
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
          <Panel title="Categories">
            <p style={adminStyles.helpText}>Pick existing categories this post belongs to, and/or opt in to create the AI&apos;s suggestions.</p>

            {allCategories.length > 0 && (
              <div style={{ marginTop: 'var(--admin-space-3)' }}>
                <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--admin-space-2)' }}>Existing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {allCategories.map((c) => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.has(c.id)}
                        onChange={(e) => {
                          const next = new Set(selectedCategoryIds);
                          if (e.target.checked) next.add(c.id); else next.delete(c.id);
                          setSelectedCategoryIds(next);
                        }}
                      />
                      {c.title}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {preview.suggestedNewCategories.length > 0 && (
              <div style={{ marginTop: 'var(--admin-space-3)' }}>
                <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--admin-space-2)' }}>Suggested (create new?)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {preview.suggestedNewCategories.map((name) => (
                    <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={createCategoriesCheckboxes.has(name)}
                        onChange={(e) => {
                          const next = new Set(createCategoriesCheckboxes);
                          if (e.target.checked) next.add(name); else next.delete(name);
                          setCreateCategoriesCheckboxes(next);
                        }}
                      />
                      + {name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Tags">
            {allTags.length > 0 && (
              <div>
                <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--admin-space-2)' }}>Existing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {allTags.map((t) => (
                    <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={selectedTagIds.has(t.id)}
                        onChange={(e) => {
                          const next = new Set(selectedTagIds);
                          if (e.target.checked) next.add(t.id); else next.delete(t.id);
                          setSelectedTagIds(next);
                        }}
                      />
                      {t.title}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {preview.suggestedNewTags.length > 0 && (
              <div style={{ marginTop: 'var(--admin-space-3)' }}>
                <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--admin-space-2)' }}>Suggested (create new?)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {preview.suggestedNewTags.map((name) => (
                    <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={createTagsCheckboxes.has(name)}
                        onChange={(e) => {
                          const next = new Set(createTagsCheckboxes);
                          if (e.target.checked) next.add(name); else next.delete(name);
                          setCreateTagsCheckboxes(next);
                        }}
                      />
                      + {name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 'var(--admin-space-5)', display: 'flex', gap: 'var(--admin-space-3)' }}>
        <Button variant="primary" size="md" onClick={commit} disabled={committing || !!successAdminUrl} loading={committing}>
          {committing ? 'Creating draft…' : successAdminUrl ? 'Done' : 'Upload to Blog Posts →'}
        </Button>
      </div>
    </div>
  );
}
