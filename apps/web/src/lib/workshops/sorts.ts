// apps/web/src/lib/workshops/sorts.ts
import type { WorkshopContext } from './filters';
import { instructorKey } from './instructors';
import { firstDate } from '@/lib/dates';
import type { Sort } from '@/lib/filters';
import type { WorkshopSummary } from '@/lib/sanity';

const byDate = (a: WorkshopSummary, b: WorkshopSummary) => firstDate(a).localeCompare(firstDate(b));

/** Workshops with no price sort last in both price directions. */
const byPrice = (direction: 1 | -1) => (a: WorkshopSummary, b: WorkshopSummary) => {
  if (a.price == null || b.price == null) return Number(a.price == null) - Number(b.price == null);
  return (a.price - b.price) * direction || byDate(a, b);
};

/** The five orders a workshop listing can be sorted in. */
export const workshopSorts: Sort<WorkshopSummary, WorkshopContext>[] = [
  { value: 'soonest', label: 'sortDateAsc', compare: byDate },
  { value: 'latest', label: 'sortDateDesc', compare: (a, b) => byDate(b, a) },
  { value: 'price-low', label: 'sortPriceAsc', compare: byPrice(1) },
  { value: 'price-high', label: 'sortPriceDesc', compare: byPrice(-1) },
  { value: 'instructor', label: 'sortInstructor', compare: (a, b) => instructorKey(a).localeCompare(instructorKey(b)) || byDate(a, b) },
];
