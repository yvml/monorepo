// apps/web/src/lib/loaders/event.ts
import { today } from '@/lib/dates';
import { type EventDetail, type EventSummary, getEvent, listEvents } from '@/lib/sanity';
import { slugLoader } from './slug';
import { withDraft } from './static';
import { type Section } from '@/constants';

/** An events or exhibitions listing: the section, all its entries, and today's date, which the filters need. */
export type EventListProps = { section: Section; events: EventSummary[]; today: string };

/** An event or exhibition page. */
export type EventProps = { entry: EventDetail; draftMode?: boolean };

/**
 * The page loader for a section's listing. Events and exhibitions are one document type, so their pages differ only by
 * the section; each page file passes its own. Kept apart from the components so Next drops this module (and the server
 * code behind it) from the browser bundle.
 *
 * @param section - events or exhibitions.
 * @returns the loader to export as the page's data function.
 */
export const eventListLoader = (section: Section) =>
  withDraft<EventListProps>(async (_context, draft) => ({
    props: { section, events: await listEvents(section, draft), today: today() },
  }));

/**
 * The page loader for one event or exhibition, found by the `slug` in the address.
 *
 * @param section - events or exhibitions.
 * @returns the loader to export as the page's data function.
 */
export const eventLoader = (section: Section) => slugLoader('entry', (slug, draft) => getEvent(section, slug, draft));
