// apps/web/src/lib/filters/workshop.ts
import { personFilter } from './person';
import { referenceFilter } from './reference';
import type { ListSpec } from './types';
import { localize } from '@/i18n';
import { isPast } from '@/lib/dates';
import type { WorkshopSummary } from '@/lib/sanity';
import { byDate, byFirstPerson, byPrice } from '@/lib/sorts';

/** What the workshop filters need beyond the workshop: today, as `YYYY-MM-DD`. */
export type WorkshopContext = { today: string };

type Term = NonNullable<WorkshopSummary['workshopTypes']>[number];
const term = (reference: Term) => localize(reference.title);

const byInstructor = byFirstPerson<WorkshopSummary>((workshop) => workshop.instructors);

/**
 * How the workshop listing filters and sorts, and how it can be shown: search, instructors, types and materials
 * (several at once), availability, a price range, past workshops on or off, and five orders.
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
    personFilter<WorkshopSummary>({ key: 'instructor', label: 'filterInstructor', segment: 'instructor', pick: (workshop) => workshop.instructors }),
    referenceFilter<WorkshopSummary, Term>({ key: 'type', label: 'filterType', segment: 'type', pick: (workshop) => workshop.workshopTypes, text: term }),
    referenceFilter<WorkshopSummary, Term>({ key: 'material', label: 'filterMaterial', segment: 'material', pick: (workshop) => workshop.materials, text: term }),
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
    { value: 'instructor', label: 'sortInstructor', compare: (a, b) => byInstructor(a, b) || byDate(a, b) },
  ],
};
