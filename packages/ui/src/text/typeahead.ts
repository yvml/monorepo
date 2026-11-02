import { normalize } from './normalize';

/** An option as the typeahead lists it: what it is called and how much is behind it, which ranks it. */
export type TypeaheadOption = { id: number; name: string; count: number };

/**
 * The options that match what was typed: options whose name contains the text, ignoring case and accents, largest first
 * and then A to Z. Blank text lists every option.
 *
 * @param options - all options.
 * @param text - what was typed.
 * @returns the matching labels in list order.
 */
export function filterOptions<T extends TypeaheadOption>(options: T[], text: string): T[] {
  const needle = normalize(text.trim());
  return options
    .filter((option) => normalize(option.name).includes(needle))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** A key the typeahead reacts to. */
export type TypeaheadKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

/**
 * The next active option after an arrow or Home or End key. The list does not wrap: it stops at the ends.
 *
 * @param active - the index now active, or -1 when none.
 * @param length - how many options there are.
 * @param key - the key pressed.
 * @returns the new active index, or -1 when the list is empty.
 */
export function moveActive(active: number, length: number, key: TypeaheadKey): number {
  if (length === 0) return -1;
  switch (key) {
    case 'ArrowDown':
      return Math.min(active + 1, length - 1);
    case 'ArrowUp':
      return Math.max(active - 1, 0);
    case 'Home':
      return 0;
    case 'End':
      return length - 1;
  }
}

/**
 * The option Enter chooses: the active one, or the first when none is active.
 *
 * @param options - the listed options.
 * @param active - the active index, or -1.
 * @returns the option, or `undefined` when the list is empty.
 */
export function chosenOption<T>(options: T[], active: number): T | undefined {
  return options[active >= 0 ? active : 0];
}

/** What the typeahead calls its options, for the announcement a screen reader hears. */
export type Noun = { one: string; many: string };

/**
 * The announcement for a screen reader after the list changes.
 *
 * @param length - how many options match.
 * @param noun - what the options are called.
 * @returns `12 labels`, `1 label` or `No label matches`.
 */
export function announceCount(length: number, noun: Noun): string {
  if (length === 0) return `No ${noun.one} matches`;
  return `${length} ${length === 1 ? noun.one : noun.many}`;
}
