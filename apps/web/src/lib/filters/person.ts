// apps/web/src/lib/filters/person.ts
import { referenceFilter } from './reference';
import type { Reference } from './reference';
import type { ListSpec, MultiFilter } from './types';
import type { TextKey } from '@/i18n';
import type { PersonSummary } from '@/lib/sanity';
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

/**
 * How the people listing filters and shows people: a search over name and place, as a grid or a list. The loader orders
 * them by last name, so there is one order and no sort control.
 */
export const personListing: ListSpec<PersonSummary> = {
  filters: [
    {
      kind: 'search',
      key: 'q',
      label: 'filterSearch',
      text: (person) => [person.title ?? '', person.location ?? ''].join(' '),
    },
  ],
  sorts: [{ value: 'name', label: 'sortName', compare: () => 0 }],
  defaultSort: 'name',
  defaultView: 'grid',
  views: [
    { value: 'grid', label: 'viewGrid' },
    { value: 'list', label: 'viewList' },
  ],
};
