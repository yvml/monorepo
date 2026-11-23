// apps/web/src/lib/filters/reference.ts
import type { MultiFilter, Option } from './types';
import type { TextKey } from '@/i18n';

/** A document an item refers to, such as a person, a workshop type or a material. */
export type Reference = { _id: string; slug?: string | null };

/**
 * A filter on the documents an item refers to. The choices are the distinct references across the items and an item's
 * value is its references' slugs, so an address never carries a Sanity id. A reference with no slug cannot be addressed
 * and is left out.
 *
 * @param spec - the filter's key and label, the path word before its values, how to read the references from an item, how to name one, and how to order the choices (by name when left out).
 * @returns the filter.
 */
export function referenceFilter<T, R extends Reference>(spec: {
  key: string;
  label: TextKey;
  segment: string;
  pick: (item: T) => R[] | null | undefined;
  text: (reference: R) => string;
  order?: (a: R, b: R) => number;
}): MultiFilter<T> {
  const { key, label, segment, pick, text, order } = spec;
  return {
    kind: 'multi',
    key,
    label,
    segment,
    options: (items) => {
      const found = new Map<string, { reference: R; option: Option }>();
      for (const item of items) {
        for (const reference of pick(item) ?? []) {
          if (reference.slug) found.set(reference.slug, { reference, option: { value: reference.slug, label: text(reference) } });
        }
      }
      const entries = [...found.values()];
      entries.sort(order ? (a, b) => order(a.reference, b.reference) : (a, b) => a.option.label.localeCompare(b.option.label));
      return entries.map((entry) => entry.option);
    },
    values: (item) => (pick(item) ?? []).flatMap((reference) => (reference.slug ? [reference.slug] : [])),
  };
}
