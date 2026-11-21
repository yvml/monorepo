import { describe, expect, it } from 'vitest';
import {
  activeFilters,
  applyFilters,
  buildUrl,
  defaultState,
  isFiltered,
  optionsWithCounts,
  parseUrl,
  pathWords,
  toHref,
  unknownChoices,
} from './index';
import type { FilterState, ListSpec } from './types';

type Item = { id: string; name: string; tags: string[]; colors: string[]; price: number | null; closed: boolean; at: number };
type Ctx = { now: number };

const opts = (items: Item[], pick: (i: Item) => string[]) => [...new Set(items.flatMap(pick))].sort().map((v) => ({ value: v, label: v }));

const spec: ListSpec<Item, Ctx> = {
  defaultSort: 'soonest',
  defaultView: 'grid',
  views: [
    { value: 'grid', label: 'viewGrid' },
    { value: 'list', label: 'viewList' },
  ],
  filters: [
    { kind: 'search', key: 'q', label: 'filterSearch', text: (item) => item.name },
    { kind: 'multi', key: 'tag', segment: 'tag', label: 'filterType', options: (items) => opts(items, (i) => i.tags), values: (item) => item.tags },
    { kind: 'multi', key: 'color', label: 'filterMaterial', options: (items) => opts(items, (i) => i.colors), values: (item) => item.colors },
    {
      kind: 'select',
      key: 'state',
      segment: true,
      label: 'filterAvailability',
      options: [
        { value: 'open', label: 'availabilityOpen' },
        { value: 'closed', label: 'availabilitySoldOut' },
      ],
      matches: (item, value) => (value === 'closed') === item.closed,
    },
    { kind: 'range', key: 'price', label: 'filterPrice', value: (item) => item.price },
    { kind: 'toggle', key: 'old', label: 'includePast', matches: (item, on, ctx) => on || item.at >= ctx.now },
  ],
  sorts: [
    { value: 'soonest', label: 'sortDateAsc', compare: (a, b) => a.at - b.at },
    { value: 'price-low', label: 'sortPriceAsc', compare: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) },
  ],
};
const ctx: Ctx = { now: 10 };
const items: Item[] = [
  { id: 'a', name: 'Café glass', tags: ['glass'], colors: ['red'], price: 100, closed: false, at: 20 },
  { id: 'b', name: 'Bronze casting', tags: ['metal', 'casting'], colors: ['blue'], price: 700, closed: true, at: 12 },
  { id: 'c', name: 'Welding', tags: ['metal'], colors: ['red', 'blue'], price: null, closed: false, at: 30 },
  { id: 'd', name: 'Old quilt', tags: ['fiber'], colors: [], price: 50, closed: false, at: 5 },
];
const ids = (list: Item[]) => list.map((item) => item.id);
const read = (segments: string[], query: Record<string, string | string[]> = {}) => parseUrl(spec, segments, query) as FilterState;

describe('the address', () => {
  it('is empty at the defaults', () => {
    expect(buildUrl(spec, defaultState(spec))).toEqual({ segments: [], query: {} });
    expect(toHref(spec, '/things', defaultState(spec))).toBe('/things');
    expect(isFiltered(spec, defaultState(spec))).toBe(false);
  });

  it('puts the chosen facets in the path and everything else in the query, and reads them back', () => {
    const state = read(['tag', 'casting+metal', 'open'], { q: 'bronze', 'min-price': '50', 'max-price': '300', old: 'yes', sort: 'price-low', view: 'list' });
    expect(state.values).toEqual({
      q: 'bronze',
      tag: ['casting', 'metal'],
      color: [],
      state: 'open',
      price: { min: 50, max: 300 },
      old: true,
    });
    expect(state.sort).toBe('price-low');
    expect(state.view).toBe('list');
    expect(buildUrl(spec, state)).toEqual({
      segments: ['tag', 'casting+metal', 'open'],
      query: { q: 'bronze', 'min-price': '50', 'max-price': '300', old: 'yes', sort: 'price-low', view: 'list' },
    });
  });

  it('gives each state one address: any order of segments is written back in the spec order, values sorted and unique', () => {
    const state = read(['open', 'tag', 'metal+casting+metal']);
    expect(buildUrl(spec, state).segments).toEqual(['tag', 'casting+metal', 'open']);
  });

  it('reads /tag/glass/open as written in the brief', () => {
    expect(toHref(spec, '/things', read(['tag', 'glass', 'closed']))).toBe('/things/tag/glass/closed');
  });

  it('keeps + readable in the query and encodes the rest', () => {
    const state = read(['tag', 'glass'], { q: 'café glass' });
    expect(toHref(spec, '/things', state)).toBe('/things/tag/glass?q=caf%C3%A9+glass');
  });

  it('writes open-ended ranges as one bound', () => {
    expect(buildUrl(spec, read([], { 'min-price': '100' })).query).toEqual({ 'min-price': '100' });
    expect(buildUrl(spec, read([], { 'max-price': '300' })).query).toEqual({ 'max-price': '300' });
  });

  it('puts a multi filter that has no path segment in the query, repeated or joined', () => {
    expect(read([], { color: ['red', 'blue'] }).values.color).toEqual(['red', 'blue']);
    expect(read([], { color: 'red+blue' }).values.color).toEqual(['red', 'blue']);
    expect(buildUrl(spec, read([], { color: ['red', 'blue'] })).query).toEqual({ color: 'blue+red' });
  });

  it('is a miss when a path segment is not one the listing has', () => {
    expect(parseUrl(spec, ['nonsense'], {})).toBeNull();
    expect(parseUrl(spec, ['tag'], {})).toBeNull();
    expect(parseUrl(spec, ['open', 'closed'], {})).toBeNull();
    expect(parseUrl(spec, ['tag', 'a', 'tag', 'b'], {})).toBeNull();
  });

  it('ignores a query value that does not parse', () => {
    expect(read([], { 'min-price': 'x', sort: 'nope', view: 'cards' })).toEqual(defaultState(spec));
  });

  it('counts a changed view and sort as not filtering', () => {
    expect(isFiltered(spec, read([], { view: 'list', sort: 'price-low' }))).toBe(false);
    expect(isFiltered(spec, read(['open']))).toBe(true);
  });

  it('knows the words a listing reserves in its path', () => {
    expect([...pathWords(spec)].sort()).toEqual(['closed', 'open', 'tag']);
  });

  it('names the chosen values that nothing offers', () => {
    expect(unknownChoices(spec, items, read(['tag', 'glass+nope']))).toEqual(['tag/nope']);
    expect(unknownChoices(spec, items, read(['tag', 'glass']))).toEqual([]);
  });
});

describe('applying filters', () => {
  const run = (segments: string[], query: Record<string, string> = {}) => ids(applyFilters(spec, items, read(segments, query), ctx));

  it('hides what the toggle hides, then shows it when on', () => {
    expect(run([])).toEqual(['b', 'a', 'c']);
    expect(run([], { old: 'yes' })).toEqual(['d', 'b', 'a', 'c']);
  });

  it('matches several choices of one filter with OR, and different filters with AND', () => {
    expect(run(['tag', 'casting+glass'])).toEqual(['b', 'a']);
    expect(run(['tag', 'casting+glass', 'closed'])).toEqual(['b']);
  });

  it('searches ignoring case and accents, every word having to match', () => {
    expect(run([], { q: 'CAFE' })).toEqual(['a']);
    expect(run([], { q: 'bronze cast' })).toEqual(['b']);
    expect(run([], { q: 'nothing like it' })).toEqual([]);
  });

  it('keeps items inside a range and drops items with no value once a bound is set', () => {
    expect(run([], { 'min-price': '50', 'max-price': '300', old: 'yes' })).toEqual(['d', 'a']);
    expect(run([], { 'min-price': '600', old: 'yes' })).toEqual(['b']);
    expect(run([], { old: 'yes' })).toContain('c');
  });

  it('sorts stably by the chosen order', () => {
    expect(run([], { old: 'yes', sort: 'price-low' })).toEqual(['d', 'a', 'b', 'c']);
  });
});

describe('choices with counts', () => {
  const counts = (segments: string[], query: Record<string, string>, key: string) =>
    Object.fromEntries(optionsWithCounts(spec, items, read(segments, query), ctx, key).map((option) => [option.value, option.count]));

  it('counts each choice against every other filter, not its own', () => {
    expect(counts(['tag', 'glass'], { old: 'yes' }, 'tag')).toEqual({ casting: 1, fiber: 1, glass: 1, metal: 2 });
  });

  it('respects the other filters', () => {
    expect(counts(['closed'], {}, 'tag')).toEqual({ casting: 1, fiber: 0, glass: 0, metal: 1 });
  });

  it('counts a select filter and labels it in the page language', () => {
    expect(optionsWithCounts(spec, items, read([], { old: 'yes' }), ctx, 'state')).toEqual([
      { value: 'open', label: 'Not sold out', count: 3 },
      { value: 'closed', label: 'Sold out', count: 1 },
    ]);
  });

  it('returns nothing for a filter that has no choices', () => {
    expect(optionsWithCounts(spec, items, defaultState(spec), ctx, 'price')).toEqual([]);
  });
});

describe('active filters', () => {
  it('gives one removable chip per choice and per other filter that is on', () => {
    const state = read(['tag', 'casting+metal', 'open'], { q: 'glass', 'min-price': '50', old: 'yes' });
    expect(activeFilters(spec, items, state).map((chip) => chip.label)).toEqual([
      'Search: “glass”',
      'Type: casting',
      'Type: metal',
      'Availability: Not sold out',
      'Price: 50–',
      'Include past',
    ]);
  });

  it('turns one choice off without touching the others', () => {
    const state = read(['tag', 'casting+metal']);
    const chip = activeFilters(spec, items, state).find((candidate) => candidate.id === 'tag:metal');
    expect(chip?.remove(state).values.tag).toEqual(['casting']);
  });

  it('shows nothing at the defaults', () => {
    expect(activeFilters(spec, items, defaultState(spec))).toEqual([]);
  });
});
