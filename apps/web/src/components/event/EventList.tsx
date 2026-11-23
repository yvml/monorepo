// apps/web/src/components/event/EventList.tsx
import { DatedList, DatedRow, ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Site } from '@/components/layout';
import { Dates } from '@/components/date';
import { dateBlock, firstDate } from '@/lib/dates';
import { type EventListProps } from '@/lib/loaders';
import { localize, t } from '@/i18n';
import { type Section } from '@/constants';
import { type EventSummary } from '@/lib/sanity';

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
            subtitle={
              entry.status === 'cancelled' ? t('cancelled') : entry.status === 'tbc' ? t('toBeConfirmed') : <Dates entry={entry} />
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
    <Site title={t(section.title)}>
      <PageColumn>
        <ListHeader title={t(section.title)} count={upcoming.length ? t('upcomingCount', { count: upcoming.length }) : undefined} />
        {empty && <Text>{t(section.empty)}</Text>}
        {upcoming.length > 0 && <Rows entries={upcoming} section={section} />}
        {undated.length > 0 && <Rows entries={undated} section={section} />}
        {past.length > 0 && (
          <>
            <ListHeader title={t('past')} />
            <Rows entries={past} section={section} />
          </>
        )}
      </PageColumn>
    </Site>
  );
}
