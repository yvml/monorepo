// apps/web/src/lib/dates.ts
import { activeLocale, t } from '@/i18n';
import type { Dated } from './sanity';

/** The first date of an entry, or an empty string. */
export const firstDate = (entry: Dated) => entry.dateTime?.entries?.[0]?.date ?? '';

/** The last day an entry covers, or an empty string. */
export function lastDate(entry: Dated) {
  const entries = entry.dateTime?.entries;
  const last = entry.dateTime?.isRange ? entries?.[0] : entries?.at(-1);
  return last?.endDate ?? last?.date ?? '';
}

/** Whether an entry is over: it has a last day and that day is before `today`. */
export const isPast = (entry: Dated, today: string) => {
  const end = lastDate(entry);
  return end !== '' && end < today;
};

/**
 * Splits entries into those still to come (or in progress) and those over.
 *
 * @param entries - the entries.
 * @param today - today as `YYYY-MM-DD`.
 * @returns the upcoming entries soonest first and the past ones latest first.
 */
export function splitByDate<T extends Dated>(entries: T[], today: string) {
  const dated = entries.filter((entry) => firstDate(entry));
  const byStart = (a: T, b: T) => firstDate(a).localeCompare(firstDate(b));
  return {
    upcoming: dated.filter((entry) => lastDate(entry) >= today).sort(byStart),
    past: dated.filter((entry) => lastDate(entry) < today).sort((a, b) => byStart(b, a)),
    undated: entries.filter((entry) => !firstDate(entry)),
  };
}

/** Dates are calendar days with no time, so they are read and shown in UTC to keep the day from shifting with the visitor's zone. */
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
/** A formatter for the page's language (`en` or `es`), so month names and the order of day, month and year follow it. */
const format = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(activeLocale(), { timeZone: 'UTC', ...options });
const FULL = { month: 'short', day: 'numeric', year: 'numeric' } as const;

/**
 * One date as text, such as `Oct 14, 2026`.
 *
 * @param iso - `YYYY-MM-DD`.
 * @returns the date in the page's language, or an empty string when there is none.
 */
export const formatDate = (iso: string) => (iso ? format(FULL).format(parse(iso)) : '');

/**
 * The month abbreviation and day for a date block.
 *
 * @param iso - `YYYY-MM-DD`, or an empty string for an entry with no date.
 * @returns for example `{ month: 'Oct', day: '14' }`; both empty when there is no date, because formatting an invalid date throws.
 */
export function dateBlock(iso: string) {
  if (!iso) return { month: '', day: '' };
  const date = parse(iso);
  return { month: format({ month: 'short' }).format(date), day: format({ day: 'numeric' }).format(date) };
}

/**
 * A readable date or date range, such as `Oct 14, 2026` or `Oct 14 – 16, 2026`, in the page's language. The range is
 * left to `Intl`, which knows how each language joins and shortens the two ends.
 *
 * @param entry - the entry.
 * @returns the text, or an empty string when there is no date.
 */
export function formatDates(entry: Dated) {
  const start = firstDate(entry);
  if (!start) return '';
  const end = lastDate(entry);
  const circa = entry.dateTime?.circa ? `${t('circa')} ` : '';
  if (!end || end === start) return circa + formatDate(start);
  // Node and browsers ship different ICU versions: Node puts thin spaces (U+2009) around the dash where Chrome puts plain
  // ones. A page is rendered by one and hydrated by the other, so the spaces are made plain to keep the text identical.
  return circa + format(FULL).formatRange(parse(start), parse(end)).replace(/[\u2009\u202f]/g, ' ');
}

/** Today as `YYYY-MM-DD`. UTC is close enough to decide upcoming from past. */
export const today = () => new Date().toISOString().slice(0, 10);

/**
 * The day and time of day at the lab, where the studio's dates and times are meant: they are stored as plain strings in
 * local time, so "now" has to be read in that zone, not the server's.
 *
 * @param now - the moment to read.
 * @param timeZone - the lab's IANA time zone.
 * @returns the day as `YYYY-MM-DD` and the time as `HH:mm`.
 */
export function localMoment(now: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value])
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

/**
 * Whether an entry is under way at a moment: one of its dates covers the day and, when that date has times, the time falls
 * between them. A date with no times, or marked all day, covers the whole day. A range uses only its first date.
 *
 * @param entry - the entry.
 * @param day - the day, `YYYY-MM-DD`.
 * @param time - the time of day, `HH:mm`.
 * @returns whether the entry is happening.
 */
export function isHappening(entry: Dated, day: string, time: string) {
  const entries = entry.dateTime?.entries ?? [];
  return (entry.dateTime?.isRange ? entries.slice(0, 1) : entries).some((item) => {
    if (!item.date || item.date > day || (item.endDate ?? item.date) < day) return false;
    if (item.allDay) return true;
    return (!item.startTime || item.startTime <= time) && (!item.endTime || time < item.endTime);
  });
}
