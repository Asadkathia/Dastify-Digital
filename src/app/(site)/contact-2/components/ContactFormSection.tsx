'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PageContent } from "./types";

type ContactFormData = PageContent["contactForm"] & { formId?: string | number | null };

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

type LexicalNode = { type: string; text?: string; children?: LexicalNode[] };
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

function lexicalToPlainText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node !== 'object') return '';
  const n = node as { root?: { children?: LexicalNode[] }; children?: LexicalNode[]; type?: string; text?: string };
  const children = n.root?.children ?? n.children;
  if (!Array.isArray(children)) return '';
  let text = '';
  for (const child of children) {
    if (!child || typeof child !== 'object') continue;
    if (child.type === 'text' && typeof child.text === 'string') {
      text += child.text;
    } else if (Array.isArray(child.children)) {
      text += (text ? '\n' : '') + lexicalToPlainText(child);
    }
  }
  return text;
}

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

type Props = { data: ContactFormData };

export default function ContactFormSection({ data }: Props) {
  const TitleTag = (data.info.titleTag || "h2") as keyof JSX.IntrinsicElements;

  const [payloadForm, setPayloadForm] = useState<PayloadForm | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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

  const usePayloadFields = Boolean(data.formId && payloadForm);
  const rows = usePayloadFields ? groupFieldsIntoRows(payloadForm!.fields) : null;
  const submitLabel = usePayloadFields
    ? (payloadForm!.submitButtonLabel || data.form.submitLabel)
    : data.form.submitLabel;

  return (
    <section className="contact-form-section">
      <span className="sec-wm g3" data-field="contactForm.watermark">
        {data.watermark}
      </span>
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info" data-r="L">
            <TitleTag
              className="contact-info-title"
              data-field="contactForm.info.title"
              data-style-field="contactForm.info.editor.nodes.title.styles"
              data-tag-field="contactForm.info.titleTag"
              data-allowed-tags="h2,h3,h4"
            >
              {data.info.title}
            </TitleTag>
            <p className="contact-info-desc" data-field="contactForm.info.description">
              {data.info.description}
            </p>

            <div className="contact-promises">
              {data.info.promises.map((item, index) => (
                <div className="contact-promise" key={`promises-${item.title}-${index}`}>
                  <div className="contact-promise-check" data-field={`contactForm.info.promises.${index}.icon`}>
                    {item.icon}
                  </div>
                  <div className="contact-promise-text">
                    <strong data-field={`contactForm.info.promises.${index}.title`}>{item.title}</strong>{" "}
                    <span data-field={`contactForm.info.promises.${index}.text`}>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-response">
              <div className="contact-response-icon" data-field="contactForm.info.response.icon">
                {data.info.response.icon}
              </div>
              <div className="contact-response-text">
                <strong data-field="contactForm.info.response.title">{data.info.response.title}</strong>{" "}
                <span data-field="contactForm.info.response.text">{data.info.response.text}</span>
              </div>
            </div>
          </div>

          <div className="contact-form-card" data-r="R">
            {submitted ? (
              <div className="demo-form-success">
                <div className="demo-form-success-icon">✓</div>
                <p className="demo-form-success-title">Message sent!</p>
                <p className="demo-form-success-sub">
                  {lexicalToPlainText(payloadForm?.confirmationMessage) ||
                    "We'll be in touch within one business day."}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                {usePayloadFields && rows ? (
                  rows.map((rowFields, rowIndex) => (
                    <div className="form-row" key={`payload-row-${rowIndex}`}>
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
                              className="form-textarea"
                              name={field.name}
                              required={field.required ?? false}
                              placeholder={field.placeholder ?? ''}
                              rows={4}
                              value={values[field.name] ?? ''}
                              onChange={(e) => setValue(field.name, e.target.value)}
                            />
                          ) : (
                            <input
                              className="form-input"
                              type={field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'}
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
                  data.form.rows.map((row, rowIndex) => (
                    <div className="form-row" key={`static-row-${rowIndex}`}>
                      {row.fields.map((field, fieldIndex) => (
                        <div
                          className={`form-group${field.full ? ' full' : ''}`}
                          key={`static-field-${field.name}-${fieldIndex}`}
                        >
                          <label className="form-label" data-field={`contactForm.form.rows.${rowIndex}.fields.${fieldIndex}.label`}>
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select className="form-select" defaultValue="">
                              <option value="">{field.placeholder}</option>
                              {field.options?.map((option, optionIndex) => (
                                <option key={`option-${optionIndex}`} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea className="form-textarea" name={field.name} placeholder={field.placeholder} rows={4} />
                          ) : (
                            <input type={field.type} className="form-input" name={field.name} placeholder={field.placeholder} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}

                {submitError && <p className="demo-form-error">{submitError}</p>}

                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn-pu contact2-submit-btn"
                    disabled={submitting || !usePayloadFields}
                    data-field="contactForm.form.submitLabel"
                    style={{ opacity: (!usePayloadFields || submitting) ? 0.7 : 1 }}
                  >
                    {submitting ? 'Sending…' : submitLabel}
                  </button>
                  <p className="form-privacy">
                    <span data-field="contactForm.form.privacyText">{data.form.privacyText} </span>
                    {data.form.privacyLink?.label ? (
                      <Link href={data.form.privacyLink.href} data-field="contactForm.form.privacyLink.label">
                        {data.form.privacyLink.label}
                      </Link>
                    ) : null}
                  </p>
                </div>

                {!usePayloadFields && data.formId && (
                  <p style={{ color: 'var(--t3)', fontSize: 12, marginTop: 8 }}>Loading form…</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
