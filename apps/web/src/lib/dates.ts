import type { Dated } from './sanity';

/** The first date of an entry, or an empty string. */
export const firstDate = (entry: Dated) => entry.dateTime?.entries?.[0]?.date ?? '';

/** The last day an entry covers, or an empty string. */
export function lastDate(entry: Dated) {
  const entries = entry.dateTime?.entries;
  const last = entry.dateTime?.isRange ? entries?.[0] : entries?.at(-1);
  return last?.endDate ?? last?.date ?? '';
}

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

const UTC = { timeZone: 'UTC' } as const;
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);

/**
 * The month abbreviation and day for a date block.
 *
 * @param iso - `YYYY-MM-DD`.
 * @returns for example `{ month: 'Oct', day: '14' }`.
 */
export function dateBlock(iso: string) {
  const date = parse(iso);
  return {
    month: date.toLocaleDateString('en-US', { ...UTC, month: 'short' }),
    day: date.toLocaleDateString('en-US', { ...UTC, day: 'numeric' }),
  };
}

/**
 * A readable date or date range, such as `Oct 14, 2026` or `Oct 14 – 16, 2026`.
 *
 * @param entry - the entry.
 * @returns the text, or an empty string when there is no date.
 */
export function formatDates(entry: Dated) {
  const start = firstDate(entry);
  if (!start) return '';
  const end = lastDate(entry);
  const full = (iso: string) =>
    parse(iso).toLocaleDateString('en-US', { ...UTC, month: 'short', day: 'numeric', year: 'numeric' });
  const circa = entry.dateTime?.circa ? 'ca. ' : '';
  if (!end || end === start) return circa + full(start);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  const endText = sameMonth ? `${parse(end).getUTCDate()}, ${parse(end).getUTCFullYear()}` : full(end);
  const startText = sameMonth
    ? parse(start).toLocaleDateString('en-US', { ...UTC, month: 'short', day: 'numeric' })
    : full(start);
  return `${circa}${startText} – ${endText}`;
}

/** Today in the dojo's calendar as `YYYY-MM-DD` (UTC is close enough to decide upcoming from past). */
export const today = () => new Date().toISOString().slice(0, 10);
