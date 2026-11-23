import { lastDate, firstDate } from './dates';
import type { ListSpec, Option } from './filters';
import { localize } from './localize';
import type { WorkshopSummary } from './sanity';

/** What the workshop filters and sorts need beyond the workshop: today, as `YYYY-MM-DD`. */
export type WorkshopContext = { today: string };

type Instructor = NonNullable<WorkshopSummary['instructors']>[number];
type Term = NonNullable<WorkshopSummary['workshopTypes']>[number];

/** The last name an instructor is sorted by. */
const lastName = (person: { title?: string | null; familyName?: string | null }) =>
  person.familyName || person.title?.split(' ').at(-1) || '';

/** The sort key of a workshop's instructors: first instructor's last name, then first name. */
const instructorKey = (workshop: WorkshopSummary) => {
  const first = workshop.instructors?.[0];
  return first ? `${lastName(first)} ${first.nameGiven ?? ''}`.toLowerCase() : '￿';
};

const isPast = (workshop: WorkshopSummary, today: string) => {
  const end = lastDate(workshop);
  return end !== '' && end < today;
};

/** The distinct values of a list of references across the workshops, as options sorted by label. */
function distinct<R extends { _id: string; slug?: string | null }>(workshops: WorkshopSummary[], pick: (w: WorkshopSummary) => R[] | null | undefined, label: (r: R) => string) {
  const seen = new Map<string, Option>();
  for (const workshop of workshops) for (const ref of pick(workshop) ?? []) seen.set(slugOf(ref), { value: slugOf(ref), label: label(ref) });
  return [...seen.values()];
}

const byLabel = (a: Option, b: Option) => a.label.localeCompare(b.label);
const term = (ref: Term) => localize(ref.title);
/** What an address says for a referenced document: its slug, or its id when it has none. */
const slugOf = (ref: { _id: string; slug?: string | null }) => ref.slug ?? ref._id;
const slugs = (refs: { _id: string; slug?: string | null }[] | null | undefined) => (refs ?? []).map(slugOf);

const byDate = (a: WorkshopSummary, b: WorkshopSummary) => firstDate(a).localeCompare(firstDate(b));

/** Workshops with no price sort last in both price directions. */
const byPrice = (direction: 1 | -1) => (a: WorkshopSummary, b: WorkshopSummary) => {
  if (a.price == null || b.price == null) return Number(a.price == null) - Number(b.price == null);
  return (a.price - b.price) * direction || byDate(a, b);
};

/**
 * How the workshop listing filters and sorts: search, instructors, types and materials (several at once), availability,
 * a price range, past workshops on or off, and five orders. The listing component renders whatever is here.
 */
export const workshopListing: ListSpec<WorkshopSummary, WorkshopContext> = {
  defaultSort: 'soonest',
  defaultView: 'grid',
  views: [
    { value: 'grid', label: 'viewGrid' },
    { value: 'list', label: 'viewList' },
  ],
  filters: [
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
      options: (workshops) => {
        const people = new Map<string, Instructor>();
        for (const workshop of workshops) for (const person of workshop.instructors ?? []) people.set(slugOf(person), person);
        return [...people.values()]
          .sort((a, b) => lastName(a).localeCompare(lastName(b)) || (a.nameGiven ?? '').localeCompare(b.nameGiven ?? ''))
          .map((person) => ({ value: slugOf(person), label: person.title ?? lastName(person) }));
      },
      segment: 'instructor',
      values: (workshop) => slugs(workshop.instructors),
    },
    {
      kind: 'multi',
      key: 'type',
      label: 'filterType',
      options: (workshops) => distinct(workshops, (w) => w.workshopTypes, term).sort(byLabel),
      segment: 'type',
      values: (workshop) => slugs(workshop.workshopTypes),
    },
    {
      kind: 'multi',
      key: 'material',
      label: 'filterMaterial',
      options: (workshops) => distinct(workshops, (w) => w.materials, term).sort(byLabel),
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
  ],
  sorts: [
    { value: 'soonest', label: 'sortDateAsc', compare: byDate },
    { value: 'latest', label: 'sortDateDesc', compare: (a, b) => byDate(b, a) },
    { value: 'price-low', label: 'sortPriceAsc', compare: byPrice(1) },
    { value: 'price-high', label: 'sortPriceDesc', compare: byPrice(-1) },
    { value: 'instructor', label: 'sortInstructor', compare: (a, b) => instructorKey(a).localeCompare(instructorKey(b)) || byDate(a, b) },
  ],
};
