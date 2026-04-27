'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { BookingFormData, SchedulerData } from '../content';
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

export default function BookingPane({
  scheduler,
  form,
}: {
  scheduler: SchedulerData;
  form: BookingFormData;
}) {
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

  if (status === 'success') {
    return (
      <div className="bk2-form-wrap">
        <div className="bk2-form__success" role="status" aria-live="polite">
          <div className="bk2-form__success-icon" aria-hidden="true">
            <Icon name="check" size={28} />
          </div>
          <h2 className="bk2-title">{form.successTitle}</h2>
          <p className="bk2-form__sub">{form.successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bk2-form-wrap">
      <h2 className="bk2-title">{scheduler.title}</h2>

      <div className="bk2-dates">
        <div className="bk2-dates__label">{scheduler.datesLabel}</div>
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
          <div className="bk2-dates__label">{scheduler.timesLabel}</div>
          <div className="bk2-times__grid">
            {scheduler.times.map((t) => (
              <button
                type="button"
                key={t}
                className={`bk2-time${selectedTime === t ? ' is-active' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
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

      <h2 className="bk2-title bk2-title--mt">{form.title}</h2>
      <form className="bk2-form" onSubmit={onSubmit} noValidate>
        {form.rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className={`bk2-form__row${row.fields.length === 1 ? ' bk2-form__row--full' : ''}`}
          >
            {row.fields.map((field) => {
              const isError = !!errors[field.name];
              const value = values[field.name] ?? '';
              return (
                <label
                  key={field.name}
                  className={`bk2-field${field.full ? ' bk2-field--full' : ''}${isError ? ' bk2-field--error' : ''}`}
                >
                  <span className="bk2-field__label">{field.label}</span>
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
            <strong>{form.errorTitle}</strong>
            <span>{form.errorBody}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="bk2-btn bk2-btn--primary bk2-btn--lg"
          disabled={status === 'submitting'}
        >
          <Icon name="calendar" size={18} />
          <span>{status === 'submitting' ? 'Confirming…' : form.submitLabel}</span>
        </button>
      </form>
    </div>
  );
}
