// apps/web/src/lib/filters/query.ts
import type { Filter, FilterValue, Range } from './types';

/** An address query as Next gives it. */
export type Query = Record<string, string | string[] | undefined>;

/** The first value of a query parameter, which may be given more than once. */
export const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** A number from address or input text, or null when there is none to read. */
export const num = (text: string | undefined) => {
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
};

/** The query names a range uses: `min-price` and `max-price`. */
const rangeKeys = (key: string) => ({ min: `min-${key}`, max: `max-${key}` });

/**
 * Reads one filter's value out of the query. A value that does not parse is left out, so the filter keeps its default.
 *
 * @param filter - a filter that lives in the query.
 * @param query - the address query.
 * @returns the value, or undefined when the query says nothing usable about it.
 */
export function readQuery<T, C>(filter: Filter<T, C>, query: Query): FilterValue | undefined {
  switch (filter.kind) {
    case 'search':
      return first(query[filter.key]);
    case 'select': {
      const raw = first(query[filter.key]);
      return raw === undefined ? undefined : filter.options.some((option) => option.value === raw) ? raw : '';
    }
    case 'multi': {
      const raw = query[filter.key];
      const all = (Array.isArray(raw) ? raw : raw ? [raw] : []).flatMap((part) => part.split(/[,+\s]+/)).filter(Boolean);
      return all.length ? [...new Set(all)] : undefined;
    }
    case 'toggle': {
      const raw = first(query[filter.key]);
      return raw === undefined ? undefined : raw === 'yes';
    }
    case 'range': {
      const keys = rangeKeys(filter.key);
      const min = num(first(query[keys.min]));
      const max = num(first(query[keys.max]));
      return min !== null || max !== null ? { min, max } : undefined;
    }
  }
}

/**
 * Writes one filter's value into a query. Whatever is at its default is left out, so the plain listing has the plain
 * address; several values are sorted so the same choices always give the same address.
 *
 * @param filter - a filter that lives in the query.
 * @param value - its value.
 * @param query - the query being built.
 */
export function writeQuery<T, C>(filter: Filter<T, C>, value: FilterValue, query: Record<string, string>) {
  switch (filter.kind) {
    case 'search':
    case 'select':
      if (value !== '') query[filter.key] = String(value);
      return;
    case 'multi': {
      const chosen = [...(value as string[])].sort();
      if (chosen.length) query[filter.key] = chosen.join(',');
      return;
    }
    case 'toggle':
      if (value !== (filter.defaultOn ?? false)) query[filter.key] = value ? 'yes' : 'no';
      return;
    case 'range': {
      const { min, max } = value as Range;
      const keys = rangeKeys(filter.key);
      if (min !== null) query[keys.min] = String(min);
      if (max !== null) query[keys.max] = String(max);
      return;
    }
  }
}
