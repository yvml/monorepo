import type { Filter, FilterState, FilterValue, ListSpec, Range } from './types';

/** An address query as Next gives it. */
export type Query = Record<string, string | string[] | undefined>;

/** An address split the way the engine reads and writes it: path segments after the listing's own path, and a query. */
export type UrlParts = { segments: string[]; query: Record<string, string> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const num = (text: string | undefined) => {
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
};

/** The value a filter has when the address says nothing about it. */
export function defaultValue<T, C>(filter: Filter<T, C>): FilterValue {
  switch (filter.kind) {
    case 'search':
    case 'select':
      return '';
    case 'multi':
      return [];
    case 'toggle':
      return filter.defaultOn ?? false;
    case 'range':
      return { min: null, max: null };
  }
}

/** The state when nothing is chosen. */
export const defaultState = <T, C>(spec: ListSpec<T, C>): FilterState => ({
  values: Object.fromEntries(spec.filters.map((filter) => [filter.key, defaultValue(filter)])),
  sort: spec.defaultSort,
  view: spec.defaultView ?? '',
});

/** The query names a range uses: `min-price` and `max-price`. */
const rangeKeys = (key: string) => ({ min: `min-${key}`, max: `max-${key}` });

/** The filters whose choice lives in the path, in the spec's order, which is the one order an address is written in. */
const pathFilters = <T, C>(spec: ListSpec<T, C>) =>
  spec.filters.filter((filter) => (filter.kind === 'multi' && filter.segment) || (filter.kind === 'select' && filter.segment));

/**
 * Reads the state out of an address: the path segments after the listing's own path, and the query.
 *
 * A segment is either a bare choice (`open`) or a name followed by its value (`material/adobe`, several values joined
 * with `+`). A segment the spec does not know, or a name with no value, makes the whole address invalid and the function
 * returns null, so a typo is a 404 and not a silently different page. Query values that do not parse fall back to the
 * default. Segments may come in any order and are written back in the spec's order, so each state has one address.
 *
 * @param spec - the listing.
 * @param segments - the path segments after the listing's path.
 * @param query - the address query.
 * @returns the state, or null when a path segment is not one the listing has.
 */
export function parseUrl<T, C>(spec: ListSpec<T, C>, segments: string[], query: Query): FilterState | null {
  const state = defaultState(spec);
  const filters = pathFilters(spec);
  const seen = new Set<string>();

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i] as string;
    const bare = filters.find((filter) => filter.kind === 'select' && filter.segment === true && filter.options.some((option) => option.value === segment));
    if (bare) {
      if (seen.has(bare.key)) return null;
      seen.add(bare.key);
      state.values[bare.key] = segment;
      continue;
    }
    const named = filters.find((filter) => (filter.kind === 'multi' || filter.kind === 'select') && filter.segment === segment);
    const value = segments[i + 1];
    if (!named || value === undefined || seen.has(named.key)) return null;
    seen.add(named.key);
    if (named.kind === 'multi') {
      state.values[named.key] = [...new Set(value.split('+').filter(Boolean))];
    } else if (named.kind === 'select') {
      if (!named.options.some((option) => option.value === value)) return null;
      state.values[named.key] = value;
    }
    i += 1;
  }

  for (const filter of spec.filters) {
    if (pathFilters(spec).includes(filter)) continue;
    switch (filter.kind) {
      case 'search': {
        const raw = first(query[filter.key]);
        if (raw !== undefined) state.values[filter.key] = raw;
        break;
      }
      case 'select': {
        const raw = first(query[filter.key]);
        if (raw !== undefined) state.values[filter.key] = filter.options.some((option) => option.value === raw) ? raw : '';
        break;
      }
      case 'multi': {
        const raw = query[filter.key];
        const all = (Array.isArray(raw) ? raw : raw ? [raw] : []).flatMap((part) => part.split(/[,+\s]+/)).filter(Boolean);
        if (all.length) state.values[filter.key] = [...new Set(all)];
        break;
      }
      case 'toggle': {
        const raw = first(query[filter.key]);
        if (raw !== undefined) state.values[filter.key] = raw === 'yes';
        break;
      }
      case 'range': {
        const keys = rangeKeys(filter.key);
        const min = num(first(query[keys.min]));
        const max = num(first(query[keys.max]));
        if (min !== null || max !== null) state.values[filter.key] = { min, max };
        break;
      }
    }
  }
  const sort = first(query.sort);
  if (sort && spec.sorts.some((option) => option.value === sort)) state.sort = sort;
  const view = first(query.view);
  if (view && spec.views?.some((option) => option.value === view)) state.view = view;
  return state;
}

/**
 * Writes the state as an address: path segments in the spec's order, then a query. Whatever is at its default is left
 * out, so the plain listing has the plain address; multiple values are sorted so the same choices always give the same
 * address.
 *
 * @param spec - the listing.
 * @param state - the state.
 * @returns the path segments and the query.
 */
export function buildUrl<T, C>(spec: ListSpec<T, C>, state: FilterState): UrlParts {
  const segments: string[] = [];
  const query: Record<string, string> = {};
  for (const filter of spec.filters) {
    const value = state.values[filter.key] ?? defaultValue(filter);
    if (filter.kind === 'multi') {
      const chosen = [...(value as string[])].sort();
      if (!chosen.length) continue;
      if (filter.segment) segments.push(filter.segment, chosen.join('+'));
      else query[filter.key] = chosen.join(',');
    } else if (filter.kind === 'select') {
      if (value === '') continue;
      if (filter.segment === true) segments.push(String(value));
      else if (filter.segment) segments.push(filter.segment, String(value));
      else query[filter.key] = String(value);
    } else if (filter.kind === 'search') {
      if (value !== '') query[filter.key] = String(value);
    } else if (filter.kind === 'toggle') {
      if (value !== (filter.defaultOn ?? false)) query[filter.key] = value ? 'yes' : 'no';
    } else {
      const { min, max } = value as Range;
      const keys = rangeKeys(filter.key);
      if (min !== null) query[keys.min] = String(min);
      if (max !== null) query[keys.max] = String(max);
    }
  }
  if (state.sort !== spec.defaultSort) query.sort = state.sort;
  if (state.view !== (spec.defaultView ?? '')) query.view = state.view;
  return { segments, query };
}

/**
 * The address for a state, as a path and query string.
 *
 * @param spec - the listing.
 * @param basePath - the listing's own path, such as `/workshops`.
 * @param state - the state.
 * @returns for example `/workshops/material/adobe/open?sort=price-low`.
 */
export function toHref<T, C>(spec: ListSpec<T, C>, basePath: string, state: FilterState) {
  const { segments, query } = buildUrl(spec, state);
  const path = [basePath, ...segments.map(encodeURIComponent)].join('/');
  // A plus sign in a value stays encoded (%2B): a bare one reads back as a space. Commas, which join several values, are legal as they are.
  const search = new URLSearchParams(query).toString().replace(/%2C/g, ',');
  return search ? `${path}?${search}` : path;
}

/**
 * The chosen values that the items do not offer, such as `material/nope`. An address with one is a 404.
 *
 * @param spec - the listing.
 * @param items - all the items.
 * @param state - the state.
 * @returns the unknown values, or an empty array.
 */
export function unknownChoices<T, C>(spec: ListSpec<T, C>, items: T[], state: FilterState) {
  const unknown: string[] = [];
  for (const filter of spec.filters) {
    if (filter.kind !== 'multi') continue;
    const offered = new Set(filter.options(items).map((option) => option.value));
    for (const value of state.values[filter.key] as string[]) if (!offered.has(value)) unknown.push(`${filter.key}/${value}`);
  }
  return unknown;
}

/**
 * Whether anything differs from the default, not counting the sort and the view.
 *
 * @param spec - the listing.
 * @param state - the state.
 * @returns true when at least one filter is set.
 */
export const isFiltered = <T, C>(spec: ListSpec<T, C>, state: FilterState) => {
  const { segments, query } = buildUrl(spec, { ...state, sort: spec.defaultSort, view: spec.defaultView ?? '' });
  return segments.length > 0 || Object.keys(query).length > 0;
};

/**
 * The words that mean a listing's filters when they are the first path segment: the names before values (`material`) and
 * the bare choices (`open`). Any other single segment is not a filter, so the page may be something else under the same path.
 *
 * @param spec - the listing.
 * @returns the reserved words.
 */
export function pathWords<T, C>(spec: ListSpec<T, C>) {
  const words = new Set<string>();
  for (const filter of pathFilters(spec)) {
    if (filter.kind === 'select' && filter.segment === true) for (const option of filter.options) words.add(option.value);
    else if (typeof filter.kind === 'string' && 'segment' in filter && typeof filter.segment === 'string') words.add(filter.segment);
  }
  return words;
}
