// apps/web/src/lib/workshops/filters.ts
import { type Instructor, lastName } from './instructors';
import { localize } from '@/i18n';
import { isPast } from '@/lib/dates';
import type { Filter, Option } from '@/lib/filters';
import type { WorkshopSummary } from '@/lib/sanity';

/** What the workshop filters and sorts need beyond the workshop: today, as `YYYY-MM-DD`. */
export type WorkshopContext = { today: string };

type Term = NonNullable<WorkshopSummary['workshopTypes']>[number];
type Reference = { _id: string; slug?: string | null };

/** What an address says for a referenced document is its slug, never its id. A document without one cannot be addressed, so filters leave it out. */
const slugs = (refs: Reference[] | null | undefined) => (refs ?? []).flatMap((ref) => (ref.slug ? [ref.slug] : []));
const term = (ref: Term) => localize(ref.title);
const byLabel = (a: Option, b: Option) => a.label.localeCompare(b.label);

/** The distinct values of a list of references across the workshops, as options sorted by label. */
function distinct<R extends Reference>(
  workshops: WorkshopSummary[],
  pick: (workshop: WorkshopSummary) => R[] | null | undefined,
  label: (ref: R) => string
) {
  const seen = new Map<string, Option>();
  for (const workshop of workshops) {
    for (const ref of pick(workshop) ?? []) if (ref.slug) seen.set(ref.slug, { value: ref.slug, label: label(ref) });
  }
  return [...seen.values()].sort(byLabel);
}

/** The instructors the workshops have, as options sorted by last name. */
function instructorOptions(workshops: WorkshopSummary[]) {
  const people = new Map<string, Instructor>();
  for (const workshop of workshops) {
    for (const person of workshop.instructors ?? []) if (person.slug) people.set(person.slug, person);
  }
  return [...people.values()]
    .sort((a, b) => lastName(a).localeCompare(lastName(b)) || (a.nameGiven ?? '').localeCompare(b.nameGiven ?? ''))
    .map((person) => ({ value: person.slug as string, label: person.title ?? lastName(person) }));
}

/** Search, instructors, types and materials (several at once), availability, a price range, and past workshops on or off. */
export const workshopFilters: Filter<WorkshopSummary, WorkshopContext>[] = [
  {
    kind: 'search',
    key: 'q',
    label: 'filterSearch',
    text: (workshop) =>
      [
        localize(workshop.title),
        ...(workshop.instructors ?? []).map((person) => person.title ?? ''),
        ...(workshop.workshopTypes ?? []).map(term),
        ...(workshop.materials ?? []).map(term),
      ].join(' '),
  },
  {
    kind: 'multi',
    key: 'instructor',
    label: 'filterInstructor',
    options: instructorOptions,
    segment: 'instructor',
    values: (workshop) => slugs(workshop.instructors),
  },
  {
    kind: 'multi',
    key: 'type',
    label: 'filterType',
    options: (workshops) => distinct(workshops, (workshop) => workshop.workshopTypes, term),
    segment: 'type',
    values: (workshop) => slugs(workshop.workshopTypes),
  },
  {
    kind: 'multi',
    key: 'material',
    label: 'filterMaterial',
    options: (workshops) => distinct(workshops, (workshop) => workshop.materials, term),
    segment: 'material',
    values: (workshop) => slugs(workshop.materials),
  },
  {
    kind: 'select',
    key: 'availability',
    label: 'filterAvailability',
    segment: true,
    options: [
      { value: 'open', label: 'availabilityOpen' },
      { value: 'closed', label: 'availabilitySoldOut' },
    ],
    matches: (workshop, value) => (value === 'closed' ? workshop.status === 'soldOut' : workshop.status !== 'soldOut'),
  },
  { kind: 'range', key: 'price', label: 'filterPrice', value: (workshop) => workshop.price ?? null },
  {
    kind: 'toggle',
    key: 'past',
    label: 'includePast',
    matches: (workshop, on, { today }) => on || !isPast(workshop, today),
  },
];
