import { t } from '../text';
import { defaultValue } from './state';
import type { CountedOption, Filter, FilterState, ListSpec, Option, Range } from './types';

const fold = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/** Whether one item passes one filter in the given state. A filter at its default passes everything. */
function passes<T, C>(filter: Filter<T, C>, item: T, state: FilterState, context: C) {
  const value = state.values[filter.key] ?? defaultValue(filter);
  switch (filter.kind) {
    case 'search': {
      const words = fold(String(value)).split(/\s+/).filter(Boolean);
      if (!words.length) return true;
      const text = fold(filter.text(item));
      return words.every((word) => text.includes(word));
    }
    case 'select':
      return value === '' || filter.matches(item, String(value), context);
    case 'multi': {
      const chosen = value as string[];
      return !chosen.length || filter.values(item).some((own) => chosen.includes(own));
    }
    case 'toggle':
      return filter.matches(item, value as boolean, context);
    case 'range': {
      const { min, max } = value as Range;
      if (min === null && max === null) return true;
      const own = filter.value(item);
      return own !== null && (min === null || own >= min) && (max === null || own <= max);
    }
  }
}

const passesAll = <T, C>(spec: ListSpec<T, C>, item: T, state: FilterState, context: C, except?: string) =>
  spec.filters.every((filter) => filter.key === except || passes(filter, item, state, context));

/**
 * The items that pass every filter, in the chosen order. The sort is stable, so equal items keep their order.
 *
 * @param spec - the listing.
 * @param items - the items.
 * @param state - what the visitor chose.
 * @param context - what the filters and sorts need beyond the item, such as today's date.
 * @returns the matching items, sorted.
 */
export function applyFilters<T, C>(spec: ListSpec<T, C>, items: T[], state: FilterState, context: C) {
  const sort = spec.sorts.find((option) => option.value === state.sort) ?? spec.sorts.find((option) => option.value === spec.defaultSort);
  const matches = items.filter((item) => passesAll(spec, item, state, context));
  return sort ? [...matches].sort((a, b) => sort.compare(a, b, context)) : matches;
}

/**
 * The choices of a select or multi filter, each with how many items it would leave given every other filter. Choices
 * that would leave none are kept, with a count of 0, so the visitor sees them and why they are empty.
 *
 * @param spec - the listing.
 * @param items - all the items.
 * @param state - what the visitor chose.
 * @param context - what the filters need beyond the item.
 * @param key - the filter.
 * @returns the choices with their counts, in the filter's order.
 */
export function optionsWithCounts<T, C>(
  spec: ListSpec<T, C>,
  items: T[],
  state: FilterState,
  context: C,
  key: string
): CountedOption[] {
  const filter = spec.filters.find((candidate) => candidate.key === key);
  if (!filter || (filter.kind !== 'select' && filter.kind !== 'multi')) return [];
  const others = items.filter((item) => passesAll(spec, item, state, context, key));
  const options: Option[] =
    filter.kind === 'select' ? filter.options.map((option) => ({ value: option.value, label: t(option.label) })) : filter.options(items);
  return options.map((option) => ({
    ...option,
    count:
      filter.kind === 'select'
        ? others.filter((item) => (option.value === '' ? true : filter.matches(item, option.value, context))).length
        : others.filter((item) => filter.values(item).includes(option.value)).length,
  }));
}
