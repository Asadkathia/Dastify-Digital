'use client';

import { useEffect, useState } from 'react';

export type FormBlockProps = {
  type: 'form';
  formId?: string | number;
  title?: string;
  description?: string;
  layout?: 'centered' | 'left' | 'card';
  backgroundStyle?: 'none' | 'light' | 'dark' | 'brand';
};

type FormField = {
  id: string;
  name: string;
  label: string;
  fieldType: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
};

type FormData = {
  id: string;
  title: string;
  fields: FormField[];
  submitButtonLabel?: string;
  confirmationType?: 'message' | 'redirect';
  confirmationMessage?: string;
  redirect?: { url: string };
};

const bgMap: Record<string, React.CSSProperties> = {
  none: {},
  light: { background: '#f9fafb', padding: '48px 24px', borderRadius: '12px' },
  dark: { background: '#0f172a', padding: '48px 24px', borderRadius: '12px' },
  brand: { background: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)', padding: '48px 24px', borderRadius: '12px' },
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '15px',
  boxSizing: 'border-box',
  outline: 'none',
  background: '#fff',
};

export function FormBlock({ formId, title, description, layout = 'centered', backgroundStyle = 'none' }: FormBlockProps) {
  const [form, setForm] = useState<FormData | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formId) return;
    fetch(`/api/forms/${formId}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.id) setForm(data as FormData);
      })
      .catch((err) => {
        console.error('[FormBlock] failed to load form definition:', err);
      });
  }, [formId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    // Honeypot: if a bot filled the hidden "website" field, silently pretend success.
    if ((values.website ?? '').trim().length > 0) {
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          form: form.id,
          submissionData: Object.entries(values)
            .filter(([field]) => field !== 'website')
            .map(([field, value]) => ({ field, value })),
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      if (form.confirmationType === 'redirect' && form.redirect?.url) {
        window.location.href = form.redirect.url;
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[FormBlock] submission failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const align = layout === 'centered' ? 'center' : 'left';
  const maxW = layout === 'centered' ? '560px' : '100%';

  if (!formId) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
        No form selected. Edit this block and choose a form.
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
        Loading form…
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ ...bgMap[backgroundStyle], padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
        <p style={{ fontSize: '18px', fontWeight: 600, color: backgroundStyle === 'dark' || backgroundStyle === 'brand' ? '#fff' : '#0f172a' }}>
          {form.confirmationMessage || 'Thank you! We\'ll be in touch shortly.'}
        </p>
      </div>
    );
  }

  const textColor = backgroundStyle === 'dark' || backgroundStyle === 'brand' ? '#fff' : '#0f172a';
  const subtextColor = backgroundStyle === 'dark' || backgroundStyle === 'brand' ? 'rgba(255,255,255,0.75)' : '#64748b';

  return (
    <div style={{ ...bgMap[backgroundStyle], padding: backgroundStyle === 'none' ? '32px 24px' : undefined }}>
      <div style={{ maxWidth: maxW, margin: `0 ${align === 'center' ? 'auto' : '0'}` }}>
        {(title || description) && (
          <div style={{ textAlign: align, marginBottom: '28px' }}>
            {title && <h2 style={{ fontSize: '28px', fontWeight: 700, color: textColor, margin: '0 0 8px' }}>{title}</h2>}
            {description && <p style={{ fontSize: '16px', color: subtextColor, margin: 0 }}>{description}</p>}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Honeypot — hidden from humans, bots fill it and trigger rejection. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
            aria-hidden="true"
          />
          {form.fields.map((field) => (
            <div key={field.id}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: textColor, marginBottom: '6px' }}>
                {field.label}
                {field.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
              </label>
              {field.fieldType === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={4}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              ) : field.fieldType === 'select' ? (
                <select
                  name={field.name}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.fieldType === 'email' ? 'email' : field.fieldType === 'number' ? 'number' : field.fieldType === 'phone' ? 'tel' : 'text'}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
          {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 32px',
              background: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              alignSelf: align === 'center' ? 'center' : 'flex-start',
            }}
          >
            {submitting ? 'Submitting…' : (form.submitButtonLabel || 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
