// apps/web/src/lib/workshops/instructors.ts
import type { WorkshopSummary } from '@/lib/sanity';

/** One instructor of a workshop, as the listing query returns them. */
export type Instructor = NonNullable<WorkshopSummary['instructors']>[number];

/** The last name an instructor is sorted by. */
export const lastName = (person: { title?: string | null; familyName?: string | null }) =>
  person.familyName || person.title?.split(' ').at(-1) || '';

/** The sort key of a workshop's instructors: first instructor's last name, then first name. Workshops with none sort last. */
export const instructorKey = (workshop: WorkshopSummary) => {
  const first = workshop.instructors?.[0];
  return first ? `${lastName(first)} ${first.nameGiven ?? ''}`.toLowerCase() : '￿';
};
