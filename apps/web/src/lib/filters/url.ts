// apps/web/src/lib/filters/url.ts
import { isPathFilter, readPath, writePath } from './path';
import { first, type Query, readQuery, writeQuery } from './query';
import { defaultState, defaultValue } from './state';
import type { FilterState, ListSpec } from './types';

/** An address split the way the engine reads and writes it: path segments after the listing's own path, and a query. */
export type UrlParts = { segments: string[]; query: Record<string, string> };

/**
 * Reads the state out of an address: the path segments after the listing's own path, and the query. Choices in the path
 * must be ones the listing has, or the address is invalid (see `readPath`); query values that do not parse fall back to
 * the default. Segments may come in any order and are written back in the spec's order, so each state has one address.
 *
 * @param spec - the listing.
 * @param segments - the path segments after the listing's path.
 * @param query - the address query.
 * @returns the state, or null when a path segment is not one the listing has.
 */
export function parseUrl<T, C>(spec: ListSpec<T, C>, segments: string[], query: Query): FilterState | null {
  const fromPath = readPath(spec, segments);
  if (!fromPath) return null;
  const state = defaultState(spec);
  Object.assign(state.values, fromPath);

  for (const filter of spec.filters) {
    if (isPathFilter(filter)) continue;
    const value = readQuery(filter, query);
    if (value !== undefined) state.values[filter.key] = value;
  }
  const sort = first(query.sort);
  if (sort && spec.sorts.some((option) => option.value === sort)) state.sort = sort;
  const view = first(query.view);
  if (view && spec.views?.some((option) => option.value === view)) state.view = view;
  return state;
}

/**
 * Writes the state as an address: path segments in the spec's order, then a query. Whatever is at its default is left
 * out, so the plain listing has the plain address.
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
    if (isPathFilter(filter)) segments.push(...writePath(filter, value));
    else writeQuery(filter, value, query);
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
