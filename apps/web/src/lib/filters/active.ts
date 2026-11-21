// apps/web/src/lib/filters/active.ts
import { t } from '../text';
import { defaultValue, withValue } from './state';
import type { FilterState, ListSpec, Range } from './types';

/** One filter that is on, as a removable chip: what it says and how to turn it off. */
export type ActiveFilter = { id: string; label: string; remove: (state: FilterState) => FilterState };

/**
 * The filters that are on, one chip each (a multi filter gives one per choice).
 *
 * @param spec - the listing.
 * @param items - all the items, which the choices' labels come from.
 * @param state - what the visitor chose.
 * @returns the active filters in the order of the spec.
 */
export function activeFilters<T, C>(spec: ListSpec<T, C>, items: T[], state: FilterState): ActiveFilter[] {
  const out: ActiveFilter[] = [];
  for (const filter of spec.filters) {
    const value = state.values[filter.key] ?? defaultValue(filter);
    const name = t(filter.label);
    switch (filter.kind) {
      case 'search':
        if (value !== '') out.push({ id: filter.key, label: `${name}: “${String(value)}”`, remove: (s) => withValue(s, filter.key, '') });
        break;
      case 'select': {
        if (value === '') break;
        const option = filter.options.find((candidate) => candidate.value === value);
        out.push({ id: filter.key, label: `${name}: ${option ? t(option.label) : String(value)}`, remove: (s) => withValue(s, filter.key, '') });
        break;
      }
      case 'multi': {
        const options = filter.options(items);
        for (const chosen of value as string[]) {
          const label = options.find((option) => option.value === chosen)?.label ?? chosen;
          out.push({
            id: `${filter.key}:${chosen}`,
            label: `${name}: ${label}`,
            remove: (s) => withValue(s, filter.key, ((s.values[filter.key] as string[]) ?? []).filter((other) => other !== chosen)),
          });
        }
        break;
      }
      case 'toggle':
        if (value !== (filter.defaultOn ?? false)) out.push({ id: filter.key, label: name, remove: (s) => withValue(s, filter.key, filter.defaultOn ?? false) });
        break;
      case 'range': {
        const { min, max } = value as Range;
        if (min !== null || max !== null) out.push({ id: filter.key, label: `${name}: ${min ?? ''}–${max ?? ''}`, remove: (s) => withValue(s, filter.key, { min: null, max: null }) });
        break;
      }
    }
  }
  return out;
}
