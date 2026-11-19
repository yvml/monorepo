import { DatedList, DatedRow, ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import type { Section } from '@/lib/site';
import Head from 'next/head';
import NextLink from 'next/link';
import { PageTemplate } from '@/components/PageTemplate';
import { SiteLayout } from '@/components/SiteLayout';
import { WorkshopBrowser } from '@/components/WorkshopBrowser';
import {
  dateBlock,
  type EventSummary,
  firstDate,
  formatDates,
  listEntries,
  localize,
  splitByDate,
  today,
} from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { getPage, type PageDoc } from '@/lib/pages';
import { sectionForPath, SITE_NAME } from '@/lib/site';
import { listWorkshops, type WorkshopSummary } from '@/lib/workshops';

type Props = {
  section?: Section;
  page?: PageDoc;
  upcoming: EventSummary[];
  past: EventSummary[];
  undated: EventSummary[];
  workshops?: WorkshopSummary[];
  today?: string;
};

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const section = sectionForPath(context.params?.kind);
  if (!section) {
    // Not a listing: a static page at /<slug>.
    const kind = context.params?.kind;
    const page = typeof kind === 'string' ? await getPage(kind, draft) : null;
    return page
      ? { props: { page, upcoming: [], past: [], undated: [] } }
      : { notFound: true };
  }
  if (section.docType === 'workshop') {
    return {
      props: { section, upcoming: [], past: [], undated: [], workshops: await listWorkshops(draft), today: today() },
    };
  }
  const split = splitByDate(await listEntries(section, draft), today());
  return { props: { section, ...split } };
});

function Rows({ entries, section }: { entries: EventSummary[]; section: Section }) {
  return (
    <DatedList>
      {entries.map((entry) => {
        const { month, day } = dateBlock(firstDate(entry));
        return (
          <DatedRow
            key={entry._id}
            month={month}
            day={day}
            dateTime={firstDate(entry)}
            title={<NextLink href={`/${section.path}/${entry.slug}`}>{localize(entry.title)}</NextLink>}
            subtitle={entry.status === 'cancelled' ? 'Cancelled' : entry.status === 'tbc' ? 'To be confirmed' : formatDates(entry)}
            aside={entry.location}
          />
        );
      })}
    </DatedList>
  );
}

export default function Listing({ section, page, upcoming, past, undated, workshops, today: now }: Props) {
  if (page) return <PageTemplate page={page} />;
  if (!section) return null;
  if (workshops && now) {
    return (
      <SiteLayout>
        <Head>
          <title>{`${section.title} · ${SITE_NAME}`}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <PageColumn>
          <ListHeader title={section.title} />
          <WorkshopBrowser workshops={workshops} today={now} />
        </PageColumn>
      </SiteLayout>
    );
  }
  const empty = !upcoming.length && !past.length && !undated.length;

  return (
    <SiteLayout>
      <Head>
        <title>{`${section.title} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn>
        <ListHeader title={section.title} count={upcoming.length ? `${upcoming.length} upcoming` : undefined} />
        {empty && <Text>{section.empty}</Text>}
        {upcoming.length > 0 && <Rows entries={upcoming} section={section} />}
        {undated.length > 0 && <Rows entries={undated} section={section} />}
        {past.length > 0 && (
          <>
            <ListHeader title="Past" />
            <Rows entries={past} section={section} />
          </>
        )}
      </PageColumn>
    </SiteLayout>
  );
}
