// apps/web/src/lib/filters/event.ts
import type { ListSpec } from './types';
import { localize } from '@/i18n';
import { isPast } from '@/lib/dates';
import type { EventSummary } from '@/lib/sanity';
import { byDate } from '@/lib/sorts';

/** What the event filters need beyond the event: today, as `YYYY-MM-DD`. */
export type EventContext = { today: string };

/**
 * How the events and exhibitions listings filter: a search over title and place, and past entries on or off. The
 * listing shows entries by date (upcoming, undated, then past), so there is one order and no sort control.
 */
export const eventListing: ListSpec<EventSummary, EventContext> = {
  filters: [
    {
      kind: 'search',
      key: 'q',
      label: 'filterSearch',
      text: (event) => [localize(event.title), event.location ?? ''].join(' '),
    },
    {
      kind: 'toggle',
      key: 'past',
      label: 'includePast',
      matches: (event, on, { today }) => on || !isPast(event, today),
    },
  ],
  sorts: [{ value: 'soonest', label: 'sortDateAsc', compare: byDate }],
  defaultSort: 'soonest',
  defaultView: 'list',
  views: [
    { value: 'list', label: 'viewList' },
    { value: 'grid', label: 'viewGrid' },
  ],
};
