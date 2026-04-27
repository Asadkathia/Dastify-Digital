'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function buildDates(daysToShow: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  let i = 1;
  while (out.length < daysToShow && i < 60) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(d);
    i += 1;
  }
  return out;
}

const fmtKey = (d: Date) => d.toISOString().split('T')[0];
const fmtFullDate = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export default function BookingPane({ data: main }: { data: PageContent['main'] }) {
  const scheduler = main.scheduler;
  const form = main.form;
  const dates = useMemo(() => buildDates(scheduler.daysToShow ?? 10), [scheduler.daysToShow]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [values, setValues] = useState<Record<string, string>>({});
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
      setValues({});
      setSelectedDate('');
      setSelectedTime('');
    } catch (err) {
      console.error('[book-session] submit failed', err);
      setStatus('error');
    }
  };

  const schedTitle = getConvertedNodeBinding(main, { field: 'scheduler.title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const SchedTitleTag = schedTitle.Tag;
  const datesLabel = getConvertedNodeBinding(main, { field: 'scheduler.datesLabel', defaultTag: 'div' });
  const DatesLabelTag = datesLabel.Tag;
  const timesLabel = getConvertedNodeBinding(main, { field: 'scheduler.timesLabel', defaultTag: 'div' });
  const TimesLabelTag = timesLabel.Tag;
  const formTitle = getConvertedNodeBinding(main, { field: 'form.title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const FormTitleTag = formTitle.Tag;
  const successTitle = getConvertedNodeBinding(main, { field: 'form.successTitle', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const SuccessTitleTag = successTitle.Tag;
  const successBody = getConvertedNodeBinding(main, { field: 'form.successBody', defaultTag: 'p' });
  const SuccessBodyTag = successBody.Tag;
  const errorTitle = getConvertedNodeBinding(main, { field: 'form.errorTitle', defaultTag: 'strong' });
  const ErrorTitleTag = errorTitle.Tag;
  const errorBody = getConvertedNodeBinding(main, { field: 'form.errorBody', defaultTag: 'span' });
  const ErrorBodyTag = errorBody.Tag;
  const submitLabel = getConvertedNodeBinding(main, { field: 'form.submitLabel', defaultTag: 'span' });
  const SubmitLabelTag = submitLabel.Tag;

  if (status === 'success') {
    return (
      <div className="bk2-form-wrap">
        <div className="bk2-form__success" role="status" aria-live="polite">
          <div className="bk2-form__success-icon" aria-hidden="true">
            <Icon name="check" size={28} />
          </div>
          <SuccessTitleTag {...successTitle.props} className="bk2-title">{form.successTitle}</SuccessTitleTag>
          <SuccessBodyTag {...successBody.props} className="bk2-form__sub">{form.successBody}</SuccessBodyTag>
        </div>
      </div>
    );
  }

  return (
    <div className="bk2-form-wrap">
      <SchedTitleTag {...schedTitle.props} className="bk2-title">{scheduler.title}</SchedTitleTag>

      <div className="bk2-dates">
        <DatesLabelTag {...datesLabel.props} className="bk2-dates__label">{scheduler.datesLabel}</DatesLabelTag>
        <div className="bk2-dates__grid">
          {dates.map((d) => {
            const key = fmtKey(d);
            const active = selectedDate === key;
            return (
              <button
                type="button"
                key={key}
                className={`bk2-date${active ? ' is-active' : ''}`}
                onClick={() => setSelectedDate(key)}
              >
                <span className="bk2-date__day">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="bk2-date__num">{d.getDate()}</span>
                <span className="bk2-date__mo">
                  {d.toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate ? (
        <div className="bk2-times">
          <TimesLabelTag {...timesLabel.props} className="bk2-dates__label">{scheduler.timesLabel}</TimesLabelTag>
          <div className="bk2-times__grid">
            {scheduler.times.map((t, i) => {
              const tB = getConvertedNodeBinding(main, { field: `scheduler.times.${i}`, defaultTag: 'span' });
              return (
                <button
                  type="button"
                  key={t}
                  className={`bk2-time${selectedTime === t ? ' is-active' : ''}`}
                  onClick={() => setSelectedTime(t)}
                  {...tB.props}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedDate && selectedTime ? (
        <div className="bk2-confirm">
          <div className="bk2-confirm__badge">
            <Icon name="check" size={16} />
            <span>
              {fmtFullDate(new Date(`${selectedDate}T12:00:00`))} at {selectedTime}{' '}
              {scheduler.timezoneLabel}
            </span>
          </div>
        </div>
      ) : null}

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
              const labelB = getConvertedNodeBinding(main, { field: `form.rows.${rIdx}.fields.${fIdx}.label`, defaultTag: 'span' });
              const LabelTag = labelB.Tag;
              return (
                <label
                  key={field.name}
                  className={`bk2-field${field.full ? ' bk2-field--full' : ''}${isError ? ' bk2-field--error' : ''}`}
                >
                  <LabelTag {...labelB.props} className="bk2-field__label">{field.label}</LabelTag>
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
    </div>
  );
}
