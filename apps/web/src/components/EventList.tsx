import { DatedList, DatedRow, ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { SiteLayout } from '@/components/SiteLayout';
import { dateBlock, type EntrySummary, firstDate, formatDates, localize } from '@/lib/events';
import { type Section, SITE_NAME } from '@/lib/site';

export type EventListProps = {
  section: Section;
  upcoming: EntrySummary[];
  past: EntrySummary[];
  undated: EntrySummary[];
};

function Rows({ entries, section }: { entries: EntrySummary[]; section: Section }) {
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
            subtitle={
              entry.status === 'cancelled' ? 'Cancelled' : entry.status === 'tbc' ? 'To be confirmed' : formatDates(entry)
            }
            aside={entry.location}
          />
        );
      })}
    </DatedList>
  );
}

/**
 * The listing for events or exhibitions: upcoming, undated, then past.
 *
 * @param props - the section and its entries, split by date.
 * @returns the page.
 */
export function EventList({ section, upcoming, past, undated }: EventListProps) {
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
