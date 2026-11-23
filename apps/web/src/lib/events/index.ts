// apps/web/src/lib/events/index.ts
import { firstDate, isPast } from '@/lib/dates';
import { localize } from '@/i18n';
import type { ListSpec } from '@/lib/filters';
import type { EventSummary } from '@/lib/sanity';

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
  sorts: [{ value: 'soonest', label: 'sortDateAsc', compare: (a, b) => firstDate(a).localeCompare(firstDate(b)) }],
  defaultSort: 'soonest',
};
