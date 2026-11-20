import { type EventSummary, firstDate, lastDate, localize } from './events';
import { clientFor } from './sanity';

type Term = { _id: string; title: Parameters<typeof localize>[0] };

/** A workshop as the listing shows it. */
export type WorkshopSummary = EventSummary & {
  price?: number;
  status?: 'open' | 'soldOut';
  format?: 'inPerson' | 'virtual' | 'hybrid';
  imageUrl?: string | null;
  instructors?: { _id: string; title?: string; slug?: string; familyName?: string; nameGiven?: string }[];
  workshopTypes?: Term[];
  materials?: Term[];
};

const SLUG = `slug[language == "en" || _key == "en"][0].value.current`;

/**
 * Every workshop with the fields the listing filters and sorts on.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the workshops, unordered.
 */
export function listWorkshops(draft: boolean) {
  return clientFor(draft).fetch<WorkshopSummary[]>(
    `*[_type == "workshop" && defined(${SLUG})]{
      _id, _type, "slug": ${SLUG}, title, dateTime, price, status, format,
      "imageUrl": image.asset->url,
      "instructors": instructors[]->{_id, title, "slug": slug.current, familyName, nameGiven},
      "workshopTypes": workshopTypes[]->{_id, title},
      "materials": materials[]->{_id, title}
    }`
  );
}

export type Availability = 'all' | 'open' | 'soldOut';
export type SortKey = 'dateAsc' | 'dateDesc' | 'priceAsc' | 'priceDesc' | 'instructor';

export type Filters = {
  instructor: string;
  type: string;
  material: string;
  availability: Availability;
  includePast: boolean;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  instructor: '',
  type: '',
  material: '',
  availability: 'all',
  includePast: false,
  sort: 'dateAsc',
};

/** The last name an instructor is sorted by. */
const lastName = (person: { title?: string; familyName?: string }) =>
  person.familyName || person.title?.split(' ').at(-1) || '';

/** The sort key of a workshop's instructors: first instructor's last name, then first name. */
const instructorKey = (workshop: WorkshopSummary) => {
  const first = workshop.instructors?.[0];
  return first ? `${lastName(first)} ${first.nameGiven ?? ''}`.toLowerCase() : '￿';
};

/**
 * The distinct instructors across the workshops, alphabetical by last name.
 *
 * @param workshops - the workshops.
 * @returns the instructors with a display label.
 */
export function instructorOptions(workshops: WorkshopSummary[]) {
  const people = new Map<string, NonNullable<WorkshopSummary['instructors']>[number]>();
  for (const workshop of workshops) for (const person of workshop.instructors ?? []) people.set(person._id, person);
  return [...people.values()]
    .sort((a, b) => lastName(a).localeCompare(lastName(b)) || (a.nameGiven ?? '').localeCompare(b.nameGiven ?? ''))
    .map((person) => ({ value: person._id, label: person.title ?? lastName(person) }));
}

/**
 * The distinct terms (types or materials) used by the workshops, alphabetical.
 *
 * @param workshops - the workshops.
 * @param field - which taxonomy.
 * @returns the terms with a display label.
 */
export function termOptions(workshops: WorkshopSummary[], field: 'workshopTypes' | 'materials') {
  const terms = new Map<string, string>();
  for (const workshop of workshops) for (const term of workshop[field] ?? []) terms.set(term._id, localize(term.title));
  return [...terms.entries()].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Applies the filters and the sort. Workshops without a price sort last in both price directions.
 *
 * @param workshops - the workshops.
 * @param filters - the chosen filters and sort.
 * @param today - today as `YYYY-MM-DD`.
 * @returns the matching workshops in order.
 */
export function applyFilters(workshops: WorkshopSummary[], filters: Filters, today: string) {
  const matches = workshops.filter((workshop) => {
    if (!filters.includePast && lastDate(workshop) && lastDate(workshop) < today) return false;
    if (filters.instructor && !workshop.instructors?.some((person) => person._id === filters.instructor)) return false;
    if (filters.type && !workshop.workshopTypes?.some((term) => term._id === filters.type)) return false;
    if (filters.material && !workshop.materials?.some((term) => term._id === filters.material)) return false;
    if (filters.availability === 'soldOut' && workshop.status !== 'soldOut') return false;
    if (filters.availability === 'open' && workshop.status === 'soldOut') return false;
    return true;
  });

  const byDate = (a: WorkshopSummary, b: WorkshopSummary) => firstDate(a).localeCompare(firstDate(b));
  const byPrice = (direction: 1 | -1) => (a: WorkshopSummary, b: WorkshopSummary) => {
    if (a.price == null || b.price == null) return Number(a.price == null) - Number(b.price == null);
    return (a.price - b.price) * direction || byDate(a, b);
  };
  const sorters: Record<SortKey, (a: WorkshopSummary, b: WorkshopSummary) => number> = {
    dateAsc: byDate,
    dateDesc: (a, b) => byDate(b, a),
    priceAsc: byPrice(1),
    priceDesc: byPrice(-1),
    instructor: (a, b) => instructorKey(a).localeCompare(instructorKey(b)) || byDate(a, b),
  };
  return [...matches].sort(sorters[filters.sort]);
}
