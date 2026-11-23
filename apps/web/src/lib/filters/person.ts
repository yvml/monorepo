// apps/web/src/lib/filters/person.ts
import { referenceFilter } from './reference';
import type { Reference } from './reference';
import type { MultiFilter } from './types';
import type { TextKey } from '@/i18n';
import { lastName, type PersonName } from '@/lib/sorts';

/** A person an item refers to. */
type PersonReference = Reference & PersonName;

/**
 * A filter on the people an item has: the instructors of a workshop, and later the people of an event. The choices are
 * ordered by last name.
 *
 * @param spec - the filter's key and label, the path word before its values, and how to read the people from an item.
 * @returns the filter.
 */
export const personFilter = <T>(spec: { key: string; label: TextKey; segment: string; pick: (item: T) => PersonReference[] | null | undefined }): MultiFilter<T> =>
  referenceFilter<T, PersonReference>({
    ...spec,
    text: (person) => person.title ?? lastName(person),
    order: (a, b) => lastName(a).localeCompare(lastName(b)) || (a.nameGiven ?? '').localeCompare(b.nameGiven ?? ''),
  });
