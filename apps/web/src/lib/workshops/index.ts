// apps/web/src/lib/workshops/index.ts
import { workshopFilters, type WorkshopContext } from './filters';
import { workshopSorts } from './sorts';
import type { ListSpec } from '@/lib/filters';
import type { WorkshopSummary } from '@/lib/sanity';

export type { WorkshopContext };

/** How the workshop listing filters and sorts, and how it can be shown. The listing component renders whatever is here. */
export const workshopListing: ListSpec<WorkshopSummary, WorkshopContext> = {
  filters: workshopFilters,
  sorts: workshopSorts,
  defaultSort: 'soonest',
  defaultView: 'grid',
  views: [
    { value: 'grid', label: 'viewGrid' },
    { value: 'list', label: 'viewList' },
  ],
};
