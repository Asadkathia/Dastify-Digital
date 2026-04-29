'use client';

import type { FormEvent } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';
import { useBookingState } from './BookingContext';

export default function Form({ data: form }: { data: PageContent['form'] }) {
  const {
    selectedDate,
    selectedTime,
    values,
    setField,
    errors,
    setErrors,
    status,
    setStatus,
    resetValues,
  } = useBookingState();

  const validate = (): boolean => {
    const next: Record<string, boolean> = {};
    for (const row of form.rows) {
      for (const field of row.fields) {
        if (field.required) {
          const v = (values[field.name] ?? '').trim();
          if (!v) next[field.name] = true;
        }
      }
    }
    if (!selectedDate) next.__date = true;
    if (!selectedTime) next.__time = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, date: selectedDate, time: selectedTime }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      resetValues();
    } catch (err) {
      console.error('[book-session] submit failed', err);
      setStatus('error');
    }
  };

  const formTitle = getConvertedNodeBinding(form, { field: 'title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const FormTitleTag = formTitle.Tag;
  const successTitle = getConvertedNodeBinding(form, { field: 'successTitle', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const SuccessTitleTag = successTitle.Tag;
  const successBody = getConvertedNodeBinding(form, { field: 'successBody', defaultTag: 'p' });
  const SuccessBodyTag = successBody.Tag;
  const errorTitle = getConvertedNodeBinding(form, { field: 'errorTitle', defaultTag: 'strong' });
  const ErrorTitleTag = errorTitle.Tag;
  const errorBody = getConvertedNodeBinding(form, { field: 'errorBody', defaultTag: 'span' });
  const ErrorBodyTag = errorBody.Tag;
  const submitLabel = getConvertedNodeBinding(form, { field: 'submitLabel', defaultTag: 'span' });
  const SubmitLabelTag = submitLabel.Tag;

  if (status === 'success') {
    return (
      <div className="bk2-form__success" role="status" aria-live="polite">
        <div className="bk2-form__success-icon" aria-hidden="true">
          <Icon name="check" size={28} />
        </div>
        <SuccessTitleTag {...successTitle.props} className="bk2-title">{form.successTitle}</SuccessTitleTag>
        <SuccessBodyTag {...successBody.props} className="bk2-form__sub">{form.successBody}</SuccessBodyTag>
      </div>
    );
  }

  return (
    <>
      <FormTitleTag {...formTitle.props} className="bk2-title bk2-title--mt">{form.title}</FormTitleTag>
      <form className="bk2-form" onSubmit={onSubmit} noValidate>
        {form.rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className={`bk2-form__row${row.fields.length === 1 ? ' bk2-form__row--full' : ''}`}
          >
            {row.fields.map((field, fIdx) => {
              const isError = !!errors[field.name];
              const value = values[field.name] ?? '';
              const labelB = getConvertedNodeBinding(form, { field: `rows.${rIdx}.fields.${fIdx}.label`, defaultTag: 'span' });
              const LabelTag = labelB.Tag;
              const nameB = getConvertedNodeBinding(form, { field: `rows.${rIdx}.fields.${fIdx}.name`, defaultTag: 'span' });
              const placeholderB = getConvertedNodeBinding(form, { field: `rows.${rIdx}.fields.${fIdx}.placeholder`, defaultTag: 'span' });
              return (
                <label
                  key={field.name}
                  className={`bk2-field${field.full ? ' bk2-field--full' : ''}${isError ? ' bk2-field--error' : ''}`}
                >
                  <LabelTag {...labelB.props} className="bk2-field__label">{field.label}</LabelTag>
                  {/* hidden bindings so the inspector exposes structural fields (name) and the placeholder text */}
                  <span {...nameB.props} hidden aria-hidden="true" data-binding-only="true" />
                  <span {...placeholderB.props} hidden aria-hidden="true" data-binding-only="true" />
                  {field.type === 'textarea' ? (
                    <textarea
                      className="bk2-input"
                      rows={field.rows ?? 3}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="bk2-input"
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
                      className="bk2-input"
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

        {(errors.__date || errors.__time) && status !== 'submitting' ? (
          <div className="bk2-form__error" role="alert">
            <strong>Pick a slot first.</strong>
            <span>Select an available date and time above to confirm your booking.</span>
          </div>
        ) : null}

        {status === 'error' ? (
          <div className="bk2-form__error" role="alert">
            <ErrorTitleTag {...errorTitle.props}>{form.errorTitle}</ErrorTitleTag>
            <ErrorBodyTag {...errorBody.props}>{form.errorBody}</ErrorBodyTag>
          </div>
        ) : null}

        <button
          type="submit"
          className="bk2-btn bk2-btn--primary bk2-btn--lg"
          disabled={status === 'submitting'}
        >
          <Icon name="calendar" size={18} />
          <SubmitLabelTag {...submitLabel.props}>{status === 'submitting' ? 'Confirming…' : form.submitLabel}</SubmitLabelTag>
        </button>
      </form>
    </>
  );
}
