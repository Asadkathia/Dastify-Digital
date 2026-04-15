"use client";

import { useEffect, useState } from "react";
import type { PageContent } from "../content";

type PayloadField = { id: string; name: string; label?: string | null; width?: number | null; required?: boolean | null; placeholder?: string | null; blockType: string; options?: Array<{ label: string; value: string; id?: string }> | null };
type LexicalNode = { type: string; text?: string; children?: LexicalNode[] };
type PayloadForm = { id: string | number; title: string; fields: PayloadField[]; submitButtonLabel?: string | null; confirmationType?: string | null; confirmationMessage?: unknown; redirect?: { url: string } | null };

function lexicalToPlainText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(lexicalToPlainText).join(" ").trim();
  if (typeof node === "object") {
    const value = node as { root?: { children?: unknown[] }; children?: unknown[]; type?: string; text?: string };
    if (value.type === "text") return value.text || "";
    if (value.root?.children) return value.root.children.map(lexicalToPlainText).join(" ").trim();
    if (value.children) return value.children.map(lexicalToPlainText).join(" ").trim();
  }
  return "";
}

function groupFieldsIntoRows(fields: PayloadField[]): PayloadField[][] {
  const rows: PayloadField[][] = [];
  let i = 0;
  while (i < fields.length) {
    const current = fields[i];
    const next = fields[i + 1];
    if ((current.width ?? 100) <= 50 && next && (next.width ?? 100) <= 50) {
      rows.push([current, next]);
      i += 2;
    } else {
      rows.push([current]);
      i += 1;
    }
  }
  return rows;
}

type Props = { data: PageContent["newsletter"] };

export default function NewsletterSection({ data }: Props) {
  const [payloadForm, setPayloadForm] = useState<PayloadForm | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    const numericId = Number(data.formId);
    if (!Number.isFinite(numericId) || numericId <= 0) return () => {
      active = false;
    };
    fetch(`/api/forms/${numericId}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) setPayloadForm(json);
      })
      .catch(() => {
        if (active) setPayloadForm(null);
      });
    return () => {
      active = false;
    };
  }, [data.formId]);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!payloadForm) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const submissionData = payloadForm.fields.map((field) => ({ field: field.name, value: values[field.name] || "" }));
      const res = await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: payloadForm.id, submissionData }),
      });
      if (!res.ok) throw new Error("Submission failed");
      if (payloadForm.confirmationType === "redirect" && payloadForm.redirect?.url) {
        window.location.href = payloadForm.redirect.url;
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(data.form.submitErrorMessage || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const TitleTag = data.titleTag || "h2";
  const usePayloadFields = Boolean(data.formId && payloadForm);
  const rows = usePayloadFields ? groupFieldsIntoRows(payloadForm!.fields) : null;

  return (
    <section className="blog1-newsletter-section">
      <div className="wrap">
        <div className="blog1-newsletter-inner" data-r>
          <div className="chip blog1-chip-space blog1-chip-inline" data-field="newsletter.chipText">
            <span className="chip-dot blog1-chip-purple" />
            {data.chipText}
          </div>
          <TitleTag
            className="blog1-newsletter-title"
            data-field="newsletter.title"
            data-style-field="newsletter.editor.nodes.title.styles"
            data-tag-field="newsletter.titleTag"
            data-allowed-tags="h2,h3,h4"
          >
            {data.title}
          </TitleTag>
          <p className="blog1-newsletter-sub" data-field="newsletter.subtitle">{data.subtitle}</p>
          {submitted ? (
            <div className="blog1-newsletter-success">
              {lexicalToPlainText(payloadForm?.confirmationMessage) || data.form.successMessage}
            </div>
          ) : (
            <form className="blog1-newsletter-form-wrap" onSubmit={handleSubmit}>
              {usePayloadFields && rows ? (
                rows.map((row, rowIndex) => (
                  <div className="blog1-form-row" key={`${"newsletter-rows"}-${rowIndex}-${row.length}`}>
                    {row.map((field, fieldIndex) => (
                      <div className="blog1-form-group" key={`${"newsletter-fields"}-${field.name}-${fieldIndex}`} style={{ width: row.length === 2 ? "50%" : "100%" }}>
                        {field.blockType === "textarea" ? (
                          <textarea
                            className="blog1-newsletter-input blog1-newsletter-textarea"
                            name={field.name}
                            placeholder={field.placeholder || ""}
                            required={Boolean(field.required)}
                            value={values[field.name] || ""}
                            onChange={(e) => setValue(field.name, e.target.value)}
                          />
                        ) : field.blockType === "select" ? (
                          <select
                            className="blog1-newsletter-input"
                            name={field.name}
                            required={Boolean(field.required)}
                            value={values[field.name] || ""}
                            onChange={(e) => setValue(field.name, e.target.value)}
                          >
                            <option value="">{field.placeholder || field.label || "Select"}</option>
                            {(field.options || []).map((option, optionIndex) => (
                              <option key={`${"newsletter-options"}-${option.value}-${optionIndex}`} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="blog1-newsletter-input"
                            type={field.blockType === "email" ? "email" : field.blockType === "number" ? "number" : field.blockType === "tel" ? "tel" : field.blockType === "url" ? "url" : "text"}
                            name={field.name}
                            placeholder={field.placeholder || ""}
                            required={Boolean(field.required)}
                            value={values[field.name] || ""}
                            onChange={(e) => setValue(field.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="blog1-newsletter-form">
                  {data.form.rows.map((row, rowIndex) => (
                    <div className="blog1-form-row" key={`${"newsletter-static-rows"}-${rowIndex}-${row.length}`}>
                      {row.map((field, fieldIndex) => (
                        <div className="blog1-form-group" key={`${"newsletter-static-fields"}-${field.name}-${fieldIndex}`} style={{ width: row.length === 2 ? "50%" : "100%" }}>
                          <input
                            type={field.type}
                            className="blog1-newsletter-input"
                            placeholder={field.placeholder}
                            disabled
                            data-field={`newsletter.form.rows.${rowIndex}.${fieldIndex}.placeholder`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  <button
                    className="btn-pu"
                    type="submit"
                    disabled={submitting || !usePayloadFields}
                    style={{ opacity: submitting || !usePayloadFields ? 0.7 : 1 }}
                    data-field="newsletter.form.submitLabel"
                  >
                    {submitting ? "Submitting..." : data.form.submitLabel}
                  </button>
                </div>
              )}
              {usePayloadFields && (
                <div className="blog1-newsletter-form blog1-newsletter-form-payload">
                  <button
                    className="btn-pu"
                    type="submit"
                    disabled={submitting || !usePayloadFields}
                    style={{ opacity: submitting || !usePayloadFields ? 0.7 : 1 }}
                  >
                    {submitting ? "Submitting..." : payloadForm?.submitButtonLabel || data.form.submitLabel}
                  </button>
                </div>
              )}
              {submitError ? <p className="blog1-newsletter-error">{submitError}</p> : null}
            </form>
          )}
          <p className="blog1-newsletter-note" data-field="newsletter.note">{data.note}</p>
        </div>
      </div>
    </section>
  );
}
