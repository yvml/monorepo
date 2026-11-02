import type { ValidationContext } from 'sanity';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Validates an optional ISO date (`YYYY-MM-DD`). An empty value passes; use `Rule.required()` for mandatory dates.
 */
export function isoDate(value: unknown) {
  if (value === undefined || value === null || value === '') return true;
  return typeof value === 'string' && ISO_DATE.test(value)
    ? true
    : 'Use a date in the form YYYY-MM-DD.';
}

/**
 * Validates an optional 24-hour time (`HH:mm`).
 */
export function timeOfDay(value: unknown) {
  if (value === undefined || value === null || value === '') return true;
  return typeof value === 'string' && TIME.test(value) ? true : 'Use a time in the form HH:mm.';
}

/**
 * Builds a validator that requires a field to be on or after a sibling field. Both values are compared as strings,
 * which orders ISO dates and 24-hour times correctly.
 *
 * @param sibling - the name of the sibling field to compare against.
 * @param message - the error shown when the order is wrong.
 */
export function notBefore(sibling: string, message: string) {
  return (value: unknown, context: ValidationContext) => {
    const start = (context.parent as Record<string, unknown> | undefined)?.[sibling];
    if (!value || !start || typeof value !== 'string' || typeof start !== 'string') return true;
    return value >= start ? true : message;
  };
}
