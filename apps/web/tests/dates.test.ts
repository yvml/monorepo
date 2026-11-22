// apps/web/tests/dates.test.ts
import { afterEach, describe, expect, it } from 'vitest';
import { formatDates } from '../src/lib/dates';
import { setActiveLocale } from '../src/i18n';

const entry = (date: string, endDate?: string, circa = false) => ({
  dateTime: { circa, isRange: false, entries: [{ _key: 'a', date, endDate }] },
}) as Parameters<typeof formatDates>[0];

afterEach(() => setActiveLocale('en'));

describe('formatDates', () => {
  it('writes one day and a range in English', () => {
    expect(formatDates(entry('2026-10-14'))).toBe('Oct 14, 2026');
    expect(formatDates(entry('2026-10-14', '2026-10-16'))).toBe('Oct 14 – 16, 2026');
  });

  it('follows the page language', () => {
    setActiveLocale('es');
    expect(formatDates(entry('2026-10-14'))).toBe('14 oct 2026');
  });

  it('marks an approximate date', () => {
    expect(formatDates(entry('2026-10-14', undefined, true))).toBe('ca. Oct 14, 2026');
  });

  it('is empty without a date', () => {
    expect(formatDates({ dateTime: null })).toBe('');
  });
});
