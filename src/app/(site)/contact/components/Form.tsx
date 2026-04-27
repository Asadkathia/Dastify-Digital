'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FormData } from '../content';
import { Icon } from '../../home/components/_icons';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Form({ data }: { data: FormData }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Record<string, boolean> = {};
    for (const row of data.rows) {
      for (const field of row.fields) {
        if (field.required) {
          const v = (values[field.name] ?? '').trim();
          if (!v) next[field.name] = true;
        }
      }
    }
    if (!consent) next.__consent = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setValues({});
      setConsent(false);
    } catch (err) {
      console.error('[contact] submit failed', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="ct2-form-wrap">
        <div className="ct2-form__success" role="status" aria-live="polite">
          <div className="ct2-form__success-icon" aria-hidden="true">
            <Icon name="check" size={28} />
          </div>
          <h2 className="ct2-form__title">{data.successTitle}</h2>
          <p className="ct2-form__sub">{data.successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ct2-form-wrap">
      <h2 className="ct2-form__title">{data.title}</h2>
      <p className="ct2-form__sub">{data.sub}</p>
      <form className="ct2-form" onSubmit={onSubmit} noValidate>
        {data.rows.map((row, rIdx) => (
          <div key={rIdx} className={`ct2-form__row${row.fields.length === 1 ? ' ct2-form__row--full' : ''}`}>
            {row.fields.map((field) => {
              const isError = !!errors[field.name];
              const value = values[field.name] ?? '';
              return (
                <label
                  key={field.name}
                  className={`ct2-field${field.full ? ' ct2-field--full' : ''}${isError ? ' ct2-field--error' : ''}`}
                >
                  <span className="ct2-field__label">{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="ct2-input"
                      rows={field.rows ?? 4}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="ct2-input"
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.name, e.target.value)}
                    >
                      {(field.options ?? []).map((opt, i) => (
                        <option key={opt + i} value={i === 0 ? '' : opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="ct2-input"
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  )}
                </label>
              );
            })}
          </div>
        ))}

        <label className={`ct2-field ct2-field--full ct2-field--check${errors.__consent ? ' ct2-field--error' : ''}`}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked && errors.__consent) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.__consent;
                  return next;
                });
              }
            }}
          />
          <span>{data.consent}</span>
        </label>

        {status === 'error' ? (
          <div className="ct2-form__error" role="alert">
            <strong>{data.errorTitle}</strong>
            <span>{data.errorBody}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="ct2-btn ct2-btn--primary ct2-btn--lg"
          disabled={status === 'submitting'}
        >
          <Icon name="arrow" size={18} />
          <span>{status === 'submitting' ? 'Sending…' : data.submitLabel}</span>
        </button>
      </form>
    </div>
  );
}
