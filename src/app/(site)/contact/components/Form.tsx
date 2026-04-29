'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Form({ data }: { data: PageContent['form'] }) {
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

  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = titleNode.Tag;
  const subNode = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = subNode.Tag;
  const successTitle = getConvertedNodeBinding(data, { field: 'successTitle', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const SuccessTitleTag = successTitle.Tag;
  const successBody = getConvertedNodeBinding(data, { field: 'successBody', defaultTag: 'p' });
  const SuccessBodyTag = successBody.Tag;
  const consentNode = getConvertedNodeBinding(data, { field: 'consent', defaultTag: 'span' });
  const ConsentTag = consentNode.Tag;
  const errorTitle = getConvertedNodeBinding(data, { field: 'errorTitle', defaultTag: 'strong' });
  const ErrorTitleTag = errorTitle.Tag;
  const errorBody = getConvertedNodeBinding(data, { field: 'errorBody', defaultTag: 'span' });
  const ErrorBodyTag = errorBody.Tag;
  const submitLabel = getConvertedNodeBinding(data, { field: 'submitLabel', defaultTag: 'span' });
  const SubmitLabelTag = submitLabel.Tag;

  if (status === 'success') {
    return (
      <div className="ct2-form-wrap">
        <div className="ct2-form__success" role="status" aria-live="polite">
          <div className="ct2-form__success-icon" aria-hidden="true">
            <Icon name="check" size={28} />
          </div>
          <SuccessTitleTag {...successTitle.props} className="ct2-form__title">{data.successTitle}</SuccessTitleTag>
          <SuccessBodyTag {...successBody.props} className="ct2-form__sub">{data.successBody}</SuccessBodyTag>
        </div>
      </div>
    );
  }

  return (
    <div className="ct2-form-wrap">
      <TitleTag {...titleNode.props} className="ct2-form__title">{data.title}</TitleTag>
      <SubTag {...subNode.props} className="ct2-form__sub">{data.sub}</SubTag>
      <form className="ct2-form" onSubmit={onSubmit} noValidate>
        {data.rows.map((row, rIdx) => (
          <div key={rIdx} className={`ct2-form__row${row.fields.length === 1 ? ' ct2-form__row--full' : ''}`}>
            {row.fields.map((field, fIdx) => {
              const isError = !!errors[field.name];
              const value = values[field.name] ?? '';
              const labelB = getConvertedNodeBinding(data, { field: `rows.${rIdx}.fields.${fIdx}.label`, defaultTag: 'span' });
              const LabelTag = labelB.Tag;
              // Bind name + placeholder as internal-edit handles (no visible UI change).
              const nameB = getConvertedNodeBinding(data, { field: `rows.${rIdx}.fields.${fIdx}.name`, defaultTag: 'span' });
              const NameTag = nameB.Tag;
              const placeholderB = getConvertedNodeBinding(data, { field: `rows.${rIdx}.fields.${fIdx}.placeholder`, defaultTag: 'span' });
              const PlaceholderTag = placeholderB.Tag;
              return (
                <label
                  key={field.name}
                  className={`ct2-field${field.full ? ' ct2-field--full' : ''}${isError ? ' ct2-field--error' : ''}`}
                >
                  <LabelTag {...labelB.props} className="ct2-field__label">{field.label}</LabelTag>
                  {/* Editor-only bindings; not visually rendered. */}
                  <NameTag {...nameB.props} hidden>{field.name}</NameTag>
                  {field.placeholder ? <PlaceholderTag {...placeholderB.props} hidden>{field.placeholder}</PlaceholderTag> : null}
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
          <ConsentTag {...consentNode.props}>{data.consent}</ConsentTag>
        </label>

        {status === 'error' ? (
          <div className="ct2-form__error" role="alert">
            <ErrorTitleTag {...errorTitle.props}>{data.errorTitle}</ErrorTitleTag>
            <ErrorBodyTag {...errorBody.props}>{data.errorBody}</ErrorBodyTag>
          </div>
        ) : null}

        <button
          type="submit"
          className="ct2-btn ct2-btn--primary ct2-btn--lg"
          disabled={status === 'submitting'}
        >
          <Icon name="arrow" size={18} />
          <SubmitLabelTag {...submitLabel.props}>{status === 'submitting' ? 'Sending…' : data.submitLabel}</SubmitLabelTag>
        </button>
      </form>
    </div>
  );
}
