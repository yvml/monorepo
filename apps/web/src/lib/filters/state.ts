// apps/web/src/lib/filters/state.ts
import type { Filter, FilterState, FilterValue, ListSpec } from './types';

/** The state with one filter's value replaced. */
export const withValue = (state: FilterState, key: string, value: FilterValue): FilterState => ({
  ...state,
  values: { ...state.values, [key]: value },
});

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
