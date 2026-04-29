'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export type BookingState = {
  selectedDate: string;
  selectedTime: string;
  setSelectedDate: (v: string) => void;
  setSelectedTime: (v: string) => void;
  values: Record<string, string>;
  setField: (name: string, value: string) => void;
  resetValues: () => void;
  errors: Record<string, boolean>;
  setErrors: (e: Record<string, boolean>) => void;
  status: BookingStatus;
  setStatus: (s: BookingStatus) => void;
};

const Ctx = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrorsState] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<BookingStatus>('idle');

  const value = useMemo<BookingState>(
    () => ({
      selectedDate,
      selectedTime,
      setSelectedDate,
      setSelectedTime,
      values,
      setField: (name: string, v: string) => {
        setValues((prev) => ({ ...prev, [name]: v }));
        setErrorsState((prev) => {
          if (!prev[name]) return prev;
          const next = { ...prev };
          delete next[name];
          return next;
        });
      },
      resetValues: () => {
        setValues({});
        setSelectedDate('');
        setSelectedTime('');
      },
      errors,
      setErrors: setErrorsState,
      status,
      setStatus,
    }),
    [selectedDate, selectedTime, values, errors, status],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Returns the live booking state if a provider is mounted, else local-only fallback state. */
export function useBookingState(): BookingState {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  // Standalone fallback (used by the visual editor when components are rendered in isolation).
  // Intentionally inert — the editor preview doesn't book real sessions.
  return {
    selectedDate: '',
    selectedTime: '',
    setSelectedDate: () => {},
    setSelectedTime: () => {},
    values: {},
    setField: () => {},
    resetValues: () => {},
    errors: {},
    setErrors: () => {},
    status: 'idle',
    setStatus: () => {},
  };
}
