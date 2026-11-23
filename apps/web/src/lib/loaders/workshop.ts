// apps/web/src/lib/loaders/workshop.ts
import { withDraft } from './static';
import { WORKSHOPS } from '@/constants';
import { today } from '@/lib/dates';
import { buildUrl, parseUrl, pathWords, toHref, unknownChoices, workshopListing } from '@/lib/filters';
import { getWorkshop, listWorkshops, type WorkshopDetail, type WorkshopSummary } from '@/lib/sanity';

/** What `/workshops/...` shows: the listing, or one workshop's page. */
export type WorkshopRouteProps =
  | { view: 'list'; workshops: WorkshopSummary[]; today: string; draftMode?: boolean }
  | { view: 'detail'; entry: WorkshopDetail; draftMode?: boolean };

const BASE = `/${WORKSHOPS.path}`;

/**
 * The loader for everything under `/workshops`: the listing and its filtered views (`/workshops/material/adobe/open`)
 * and a workshop's own page (`/workshops/<slug>`). One catch-all page serves both, because a filtered view is a path and
 * the router cannot tell the two apart. A single segment that is not a filter word is a workshop; anything else is read
 * as filters, and an address the listing does not have (a typo, a value nothing offers) is a 404. Each filtered view has
 * one address: a different order of the same segments redirects to it.
 *
 * The page is generated ahead and cached, and a cached page has no query string, so only the path's choices are read
 * here. The query's choices (search, price, sort, view) are read in the browser by `useFilterState`, which also drops
 * any that do not parse, so an address with a stray query value shows the plain listing.
 */
export const workshopLoader = withDraft<WorkshopRouteProps>(async (context, draft) => {
  const raw = context.params?.path;
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const [only] = segments;

  if (segments.length === 1 && only && !pathWords(workshopListing).has(only)) {
    const entry = await getWorkshop(only, draft);
    return entry ? { props: { view: 'detail', entry } } : { notFound: true };
  }

  const state = parseUrl(workshopListing, segments, {});
  const workshops = await listWorkshops(draft);
  if (!state || unknownChoices(workshopListing, workshops, state).length) return { notFound: true };

  // One address per choice of path: another order of the same segments redirects to the canonical one.
  if (buildUrl(workshopListing, state).segments.join('/') !== segments.join('/')) {
    const prefix = context.locale && context.locale !== context.defaultLocale ? `/${context.locale}` : '';
    return { redirect: { destination: `${prefix}${toHref(workshopListing, BASE, state)}`, permanent: false } };
  }
  return { props: { view: 'list', workshops, today: today() } };
});
