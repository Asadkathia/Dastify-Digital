'use client';

import { useMemo } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';
import { useBookingState } from './BookingContext';

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

export default function Scheduler({ data: scheduler }: { data: PageContent['scheduler'] }) {
  const dates = useMemo(() => buildDates(scheduler.daysToShow ?? 10), [scheduler.daysToShow]);
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime, status } = useBookingState();

  const schedTitle = getConvertedNodeBinding(scheduler, { field: 'title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const SchedTitleTag = schedTitle.Tag;
  const datesLabel = getConvertedNodeBinding(scheduler, { field: 'datesLabel', defaultTag: 'div' });
  const DatesLabelTag = datesLabel.Tag;
  const timesLabel = getConvertedNodeBinding(scheduler, { field: 'timesLabel', defaultTag: 'div' });
  const TimesLabelTag = timesLabel.Tag;
  const tzLabel = getConvertedNodeBinding(scheduler, { field: 'timezoneLabel', defaultTag: 'span' });
  const TzLabelTag = tzLabel.Tag;

  if (status === 'success') return null;

  return (
    <>
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
              const tB = getConvertedNodeBinding(scheduler, { field: `times.${i}`, defaultTag: 'span' });
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
              <TzLabelTag {...tzLabel.props}>{scheduler.timezoneLabel}</TzLabelTag>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
