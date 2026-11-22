// apps/web/src/lib/event-loaders.ts
import { splitByDate, today } from './dates';
import { type Section } from '@/constants';
import { type EventDetail, type EventSummary, getEvent, listEvents } from './sanity';
import { withDraft } from './static-props';

/** An events or exhibitions listing: the section and its entries, split by date. */
export type EventListProps = { section: Section; upcoming: EventSummary[]; past: EventSummary[]; undated: EventSummary[] };

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
    props: { section, ...splitByDate(await listEvents(section, draft), today()) },
  }));

/**
 * The page loader for one event or exhibition, found by the `slug` in the address.
 *
 * @param section - events or exhibitions.
 * @returns the loader to export as the page's data function.
 */
export const eventLoader = (section: Section) =>
  withDraft<EventProps>(async (context, draft) => {
    const slug = context.params?.slug;
    if (typeof slug !== 'string') return { notFound: true };
    const entry = await getEvent(section, slug, draft);
    return entry ? { props: { entry } } : { notFound: true };
  });
