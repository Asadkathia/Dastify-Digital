'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PageContent = import("./types").PageContent;
type HeroData = PageContent["hero"] & { formId?: string | number | null };

// ─── Payload form field types ─────────────────────────────────────────────────

type PayloadField = {
  id: string;
  name: string;
  label?: string | null;
  width?: number | null;
  required?: boolean | null;
  placeholder?: string | null;
  blockType: string;
  options?: Array<{ label: string; value: string; id?: string }> | null;
};

type LexicalTextNode = { type: 'text'; text?: string };
type LexicalParagraphNode = { type: string; children?: LexicalNode[] };
type LexicalNode = LexicalTextNode | LexicalParagraphNode;
type LexicalRoot = { root?: { children?: LexicalNode[] } };

type PayloadForm = {
  id: string | number;
  title: string;
  fields: PayloadField[];
  submitButtonLabel?: string | null;
  confirmationType?: 'message' | 'redirect' | null;
  confirmationMessage?: string | LexicalRoot | null;
  redirect?: { url: string } | null;
};

/** Extract plain text from a Payload/Lexical rich-text object. */
function lexicalToPlainText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node !== 'object') return '';
  const maybeRoot = node as LexicalRoot;
  const children = maybeRoot.root?.children ?? (node as LexicalParagraphNode).children;
  if (!Array.isArray(children)) return '';
  let text = '';
  for (const child of children) {
    if (!child || typeof child !== 'object') continue;
    if ((child as LexicalTextNode).type === 'text' && typeof (child as LexicalTextNode).text === 'string') {
      text += (child as LexicalTextNode).text;
    } else if (Array.isArray((child as LexicalParagraphNode).children)) {
      text += (text ? '\n' : '') + lexicalToPlainText(child);
    }
  }
  return text;
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

/**
 * Group flat Payload fields into rows using the `width` property.
 * width=50  → half width (pair fields together)
 * width=100 or null → full width (own row)
 * We greedily fill rows: two consecutive 50-width fields share a row.
 */
function groupFieldsIntoRows(fields: PayloadField[]): PayloadField[][] {
  const rows: PayloadField[][] = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    const w = field.width ?? 100;
    if (w <= 50 && i + 1 < fields.length && (fields[i + 1].width ?? 100) <= 50) {
      rows.push([field, fields[i + 1]]);
      i += 2;
    } else {
      rows.push([field]);
      i += 1;
    }
  }
  return rows;
}

function inputType(blockType: string): string {
  switch (blockType) {
    case 'email': return 'email';
    case 'number': return 'number';
    default: return 'text';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoHero({ data }: { data: HeroData }) {
  const TitleTag = (data.titleTag || "h1") as "h1" | "h2" | "h3" | "h4" | "p" | "span";

  const [payloadForm, setPayloadForm] = useState<PayloadForm | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch form definition from Payload when formId is available. Skip if the
  // stored id is empty/invalid (e.g. not yet created or editor corruption).
  useEffect(() => {
    const raw = data.formId;
    if (raw == null || raw === '') return;
    const numericId = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(numericId) || numericId <= 0) return;
    let active = true;
    fetch(`/api/forms/${numericId}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (active && d?.id) setPayloadForm(d as PayloadForm); })
      .catch(() => null);
    return () => { active = false; };
  }, [data.formId]);

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payloadForm) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: payloadForm.id,
          submissionData: Object.entries(values).map(([field, value]) => ({ field, value })),
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      if (payloadForm.confirmationType === 'redirect' && payloadForm.redirect?.url) {
        window.location.href = payloadForm.redirect.url;
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Determine what to render in the form card
  const usePayloadFields = Boolean(data.formId && payloadForm);
  const rows = usePayloadFields ? groupFieldsIntoRows(payloadForm!.fields) : null;
  const submitLabel = usePayloadFields
    ? (payloadForm!.submitButtonLabel || data.form.submitLabel)
    : data.form.submitLabel;

  return (
    <section className="demo-hero">
      <span className="sec-wm g1" data-field="hero.watermark">
        {data.watermark}
      </span>
      <div className="wrap">
        <div className="demo-grid">

          {/* ── Left column ── */}
          <div className="demo-value" data-r="L">
            <div
              className="demo-badge"
              data-field="hero.badge"
              data-style-field="hero.editor.nodes.badge.styles"
            >
              {data.badge}
            </div>
            <TitleTag
              className="demo-title"
              data-field="hero.title"
              data-style-field="hero.editor.nodes.title.styles"
              data-tag-field="hero.titleTag"
              data-allowed-tags="h1,h2,h3"
            >
              {data.title}
            </TitleTag>
            <p
              className="demo-sub"
              data-field="hero.subtitle"
              data-style-field="hero.editor.nodes.subtitle.styles"
            >
              {data.subtitle}
            </p>

            <div className="demo-deliverables">
              {data.deliverables.map((item, index) => (
                <div className="demo-deliverable" key={`deliverable-${index}`}>
                  <div className={`demo-del-num ${item.color}`} data-field={`hero.deliverables.${index}.number`}>
                    {item.number}
                  </div>
                  <div>
                    <div className="demo-del-title" data-field={`hero.deliverables.${index}.title`}>
                      {item.title}
                    </div>
                    <div className="demo-del-desc" data-field={`hero.deliverables.${index}.description`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="demo-trust">
              {data.trustItems.map((item, index) => (
                <div className="demo-trust-item" key={`trust-${index}`}>
                  <div className="demo-trust-icon" data-field={`hero.trustItems.${index}.icon`}>
                    {item.icon}
                  </div>
                  <span data-field={`hero.trustItems.${index}.label`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: form card ── */}
          <div className="demo-form-card" data-r="R">
            <div className="demo-form-title" data-field="hero.form.title">
              {data.form.title}
            </div>
            <div className="demo-form-sub" data-field="hero.form.subtitle">
              {data.form.subtitle}
            </div>

            {submitted ? (
              <div className="demo-form-success">
                <div className="demo-form-success-icon">✓</div>
                <p className="demo-form-success-title">Request received!</p>
                <p className="demo-form-success-sub">
                  {lexicalToPlainText(payloadForm?.confirmationMessage) ||
                    "We'll be in touch within one business day."}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>

                {/* ── Payload-driven fields (Pattern B) ── */}
                {usePayloadFields && rows ? (
                  rows.map((rowFields, rowIndex) => (
                    <div
                      className="form-row"
                      key={`payload-row-${rowIndex}`}
                    >
                      {rowFields.map((field) => (
                        <div
                          className={`form-group${(field.width ?? 100) >= 100 || rowFields.length === 1 ? ' full' : ''}`.trimEnd()}
                          key={field.id}
                        >
                          <label className="form-label">
                            {field.label}
                            {field.required && <span className="form-required"> *</span>}
                          </label>

                          {field.blockType === 'select' ? (
                            <select
                              className="form-select"
                              name={field.name}
                              required={field.required ?? false}
                              value={values[field.name] ?? ''}
                              onChange={(e) => setValue(field.name, e.target.value)}
                            >
                              <option value="">{field.placeholder || 'Select…'}</option>
                              {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : field.blockType === 'textarea' ? (
                            <textarea
                              className="form-input"
                              name={field.name}
                              required={field.required ?? false}
                              placeholder={field.placeholder ?? ''}
                              rows={3}
                              value={values[field.name] ?? ''}
                              onChange={(e) => setValue(field.name, e.target.value)}
                            />
                          ) : (
                            <input
                              className="form-input"
                              type={inputType(field.blockType)}
                              name={field.name}
                              required={field.required ?? false}
                              placeholder={field.placeholder ?? ''}
                              value={values[field.name] ?? ''}
                              onChange={(e) => setValue(field.name, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  /* ── Static fallback from content.ts (no formId yet) ── */
                  data.form.rows.map((row, rowIndex) => (
                    <div className="form-row" key={`static-row-${rowIndex}`}>
                      {row.fields.map((field, fieldIndex) => (
                        <div
                          className={`form-group${field.full ? ' full' : ''}`.trimEnd()}
                          key={`static-field-${field.name}-${fieldIndex}`}
                        >
                          <label className="form-label" data-field={`hero.form.rows.${rowIndex}.fields.${fieldIndex}.label`}>
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select className="form-select" defaultValue="">
                              <option value="" data-field={`hero.form.rows.${rowIndex}.fields.${fieldIndex}.placeholder`}>
                                {field.placeholder}
                              </option>
                              {field.options?.map((option, optionIndex) => (
                                <option key={`option-${optionIndex}`} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              className="form-input"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}

                {submitError && (
                  <p className="demo-form-error">{submitError}</p>
                )}

                <button
                  type="submit"
                  className="btn-pu demo-submit"
                  disabled={submitting || !usePayloadFields}
                  data-field="hero.form.submitLabel"
                  style={{ opacity: (!usePayloadFields || submitting) ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting…' : submitLabel}
                </button>

                {!usePayloadFields && data.formId && (
                  <p className="demo-form-note" style={{ color: 'var(--t3)', fontSize: 12 }}>
                    Loading form…
                  </p>
                )}

                <p className="demo-form-note">
                  <span data-field="hero.form.note">{data.form.note}</span>
                  {data.form.noteLink?.label ? (
                    <>
                      <br />
                      <Link
                        href={data.form.noteLink.href || '#'}
                        data-field="hero.form.noteLink.label"
                      >
                        {data.form.noteLink.label}
                      </Link>
                    </>
                  ) : null}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
