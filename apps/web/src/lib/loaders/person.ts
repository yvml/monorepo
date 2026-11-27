// apps/web/src/lib/loaders/person.ts
import { slugLoader } from './slug';
import { listLoader } from './list';
import { getPerson, listPeople, type PersonDetail, type PersonSummary } from '@/lib/sanity';

/** The people listing. */
export type PersonListProps = { people: PersonSummary[] };

/** One person. */
export type PersonProps = { person: PersonDetail };

/** The loader for the people listing. */
export const personListLoader = listLoader('people', listPeople);

/** The loader for one person, found by the `slug` in the address. */
export const personLoader = slugLoader('person', getPerson);
