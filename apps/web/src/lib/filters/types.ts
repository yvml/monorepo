import type { TextKey } from '../text';

/** One choice of a select or multi filter. */
export type Option = { value: string; label: string };

/** A price-like numeric bound; `null` leaves that end open. */
export type Range = { min: number | null; max: number | null };

type Base = {
  /** The name in the address (`?material=a,b`) and in the state. Unique within a listing. */
  key: string;
  /** The label, as a key of the app's text. */
  label: TextKey;
};

/** Free text, matched against what `text` returns for each item. */
export type SearchFilter<T> = Base & { kind: 'search'; text: (item: T) => string };

/** One choice out of several, or none. `matches` decides whether an item fits the chosen value. */
export type SelectFilter<T, C> = Base & {
  kind: 'select';
  /** Where the choice goes in the address: `true` puts the value alone in the path (`/open`), a name puts it after that name (`/availability/open`). Left out, it goes in the query. */
  segment?: string | true;
  /** The choices, by value, each labelled with a key of the app's text so the label follows the page's language. */
  options: { value: string; label: TextKey }[];
  matches: (item: T, value: string, context: C) => boolean;
};

/** Any number of choices; an item matches when it has at least one of them. */
export type MultiFilter<T> = Base & {
  kind: 'multi';
  /** The name before the values in the path (`/material/adobe+glass`). Left out, the values go in the query. */
  segment?: string;
  /** The choices the items offer. */
  options: (items: T[]) => Option[];
  /** The values one item has. */
  values: (item: T) => string[];
};

/** On or off. `matches` decides whether an item fits the state. */
export type ToggleFilter<T, C> = Base & {
  kind: 'toggle';
  defaultOn?: boolean;
  matches: (item: T, on: boolean, context: C) => boolean;
};

/** A numeric range over what `value` returns for each item. */
export type RangeFilter<T> = Base & { kind: 'range'; value: (item: T) => number | null };

/** Every kind of filter a listing can offer. */
export type Filter<T, C = undefined> =
  | SearchFilter<T>
  | SelectFilter<T, C>
  | MultiFilter<T>
  | ToggleFilter<T, C>
  | RangeFilter<T>;

/** One way to order a listing. */
export type Sort<T, C = undefined> = {
  value: string;
  label: TextKey;
  compare: (a: T, b: T, context: C) => number;
};

/** Everything a listing needs to filter and sort its items: define one per listing. */
export type ListSpec<T, C = undefined> = {
  filters: Filter<T, C>[];
  sorts: Sort<T, C>[];
  defaultSort: string;
  /** How the listing can be shown, such as a grid or a list. Leave out when there is one way. */
  views?: { value: string; label: TextKey }[];
  defaultView?: string;
};

/** The value of one filter, by kind: text, a choice, choices, a flag, or a range. */
export type FilterValue = string | string[] | boolean | Range;

/** What the visitor chose. It is what the address holds. */
export type FilterState = { values: Record<string, FilterValue>; sort: string; view: string };

/** A choice with the number of items it would leave. */
export type CountedOption = Option & { count: number };
