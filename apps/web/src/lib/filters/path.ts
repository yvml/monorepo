// apps/web/src/lib/filters/path.ts
import type { Filter, FilterValue, ListSpec, MultiFilter, SelectFilter } from './types';

/** A filter whose choice is written in the address path, not in the query. */
type PathFilter<T, C> = MultiFilter<T> | SelectFilter<T, C>;

/** Whether a filter's choice lives in the path. */
export const isPathFilter = <T, C>(filter: Filter<T, C>): filter is PathFilter<T, C> =>
  (filter.kind === 'multi' || filter.kind === 'select') && Boolean(filter.segment);

/** The filters whose choice lives in the path, in the spec's order, which is the one order an address is written in. */
const pathFilters = <T, C>(spec: ListSpec<T, C>) => spec.filters.filter(isPathFilter);

/**
 * Reads the choices out of the path segments after the listing's own path.
 *
 * A segment is either a bare choice (`open`) or a name followed by its value (`material/adobe`, several values joined
 * with `+`). A segment the spec does not know, or a name with no value, makes the whole address invalid, so a typo is a
 * 404 and not a silently different page. Segments may come in any order.
 *
 * @param spec - the listing.
 * @param segments - the path segments after the listing's path.
 * @returns the value of each filter the path names, or null when a segment is not one the listing has.
 */
export function readPath<T, C>(spec: ListSpec<T, C>, segments: string[]) {
  const filters = pathFilters(spec);
  const values: Record<string, FilterValue> = {};
  const seen = new Set<string>();

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i] as string;
    const bare = filters.find((filter) => filter.kind === 'select' && filter.segment === true && filter.options.some((option) => option.value === segment));
    if (bare) {
      if (seen.has(bare.key)) return null;
      seen.add(bare.key);
      values[bare.key] = segment;
      continue;
    }
    const named = filters.find((filter) => filter.segment === segment);
    const value = segments[i + 1];
    if (!named || value === undefined || seen.has(named.key)) return null;
    seen.add(named.key);
    if (named.kind === 'multi') {
      values[named.key] = [...new Set(value.split('+').filter(Boolean))];
    } else {
      if (!named.options.some((option) => option.value === value)) return null;
      values[named.key] = value;
    }
    i += 1;
  }
  return values;
}

/**
 * The path segments for one filter's choice. Nothing is written for a choice that is empty. Several values are sorted
 * so the same choices always give the same address.
 *
 * @param filter - a filter that lives in the path.
 * @param value - its value.
 * @returns the segments: a name and its values, or a bare choice.
 */
export function writePath<T, C>(filter: PathFilter<T, C>, value: FilterValue) {
  if (filter.kind === 'multi') {
    const chosen = [...(value as string[])].sort();
    return chosen.length && filter.segment ? [filter.segment, chosen.join('+')] : [];
  }
  if (value === '') return [];
  return filter.segment === true ? [String(value)] : [filter.segment as string, String(value)];
}

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
    else if (typeof filter.segment === 'string') words.add(filter.segment);
  }
  return words;
}
