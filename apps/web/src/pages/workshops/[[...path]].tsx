// apps/web/src/pages/workshops/[[...path]].tsx
import { ListHeader, PageColumn } from '@hmidmismi/ui';
import { SiteLayout } from '@/components/SiteLayout';
import { WorkshopList } from '@/components/WorkshopList';
import { WorkshopPage } from '@/components/WorkshopPage';
import { today } from '@/lib/dates';
import { buildUrl, parseUrl, pathWords, type Query, toHref, unknownChoices } from '@/lib/filters';
import { withPreviewGate } from '@/lib/gate';
import { WORKSHOPS } from '@/lib/navigation';
import { getWorkshop, listWorkshops, type WorkshopDetail, type WorkshopSummary } from '@/lib/sanity';
import { t } from '@/lib/text';
import { workshopListing } from '@/lib/workshop-listing';

type Props =
  | { view: 'list'; workshops: WorkshopSummary[]; today: string; draftMode?: boolean }
  | { view: 'detail'; entry: WorkshopDetail; draftMode?: boolean };

const BASE = `/${WORKSHOPS.path}`;

/**
 * Everything under `/workshops`: the listing and its filtered views (`/workshops/material/adobe/open`) and a workshop's
 * own page (`/workshops/<slug>`). One catch-all page serves both, because a filtered view is a path and the router cannot
 * tell the two apart. A single segment that is not a filter word is a workshop; anything else is read as filters, and an
 * address the listing does not have (a typo, a value nothing offers) is a 404. Each filtered view has one address: a
 * different order of the same segments redirects to it.
 */
export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const raw = context.params?.path;
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const [only] = segments;

  if (segments.length === 1 && only && !pathWords(workshopListing).has(only)) {
    const entry = await getWorkshop(only, draft);
    return entry ? { props: { view: 'detail', entry } } : { notFound: true };
  }

  const { path: _path, ...query } = context.query as Query;
  const state = parseUrl(workshopListing, segments, query);
  const workshops = await listWorkshops(draft);
  if (!state || unknownChoices(workshopListing, workshops, state).length) return { notFound: true };

  // Compared as parts, not as strings, so the order of the query parameters does not matter; the segment order does.
  const canonical = buildUrl(workshopListing, state);
  const same =
    canonical.segments.join('/') === segments.join('/') &&
    Object.keys(canonical.query).length === Object.keys(query).length &&
    Object.entries(canonical.query).every(([key, value]) => query[key] === value);
  if (!same) {
    const prefix = context.locale && context.locale !== context.defaultLocale ? `/${context.locale}` : '';
    return { redirect: { destination: `${prefix}${toHref(workshopListing, BASE, state)}`, permanent: false } };
  }
  return { props: { view: 'list', workshops, today: today() } };
});

export default function Page(props: Props) {
  if (props.view === 'detail') return <WorkshopPage entry={props.entry} draftMode={props.draftMode} />;
  return (
    <SiteLayout title={t(WORKSHOPS.title)}>
      <PageColumn>
        <ListHeader title={t(WORKSHOPS.title)} />
        <WorkshopList workshops={props.workshops} today={props.today} draft={Boolean(props.draftMode)} />
      </PageColumn>
    </SiteLayout>
  );
}
