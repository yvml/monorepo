// apps/web/src/components/event/EventList.tsx
import { DatedList, DatedRow, ListHeader, PageColumn, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { Dates } from '@/components/date';
import { FilterBar, FilterSummary } from '@/components/filters';
import { Site } from '@/components/layout';
import { type Section } from '@/constants';
import { useFilterState } from '@/hooks';
import { localize, t } from '@/i18n';
import { dateBlock, firstDate, splitByDate } from '@/lib/dates';
import { eventListing } from '@/lib/events';
import { activeFilters, applyFilters } from '@/lib/filters';
import { type EventListProps } from '@/lib/loaders';
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
 * The listing for events or exhibitions: a filter bar, then the entries that match, upcoming first, then undated, then
 * past (hidden until asked for). The choices live in the address, so a filtered view can be linked.
 *
 * @param props - the section, its entries, and today's date.
 * @returns the page.
 */
export function EventList({ section, events, today }: EventListProps) {
  const context = useMemo(() => ({ today }), [today]);
  const { state, change, reset } = useFilterState(eventListing, `/${section.path}`);
  const shown = useMemo(() => applyFilters(eventListing, events, state, context), [events, state, context]);
  const active = useMemo(() => activeFilters(eventListing, events, state), [events, state]);
  const { upcoming, undated, past } = useMemo(() => splitByDate(shown, today), [shown, today]);

  return (
    <Site title={t(section.title)}>
      <PageColumn>
        <ListHeader title={t(section.title)} count={upcoming.length ? t('upcomingCount', { count: upcoming.length }) : undefined} />
        {events.length === 0 ? (
          <Text>{t(section.empty)}</Text>
        ) : (
          <Stack gap="4">
            <FilterBar spec={eventListing} items={events} context={context} state={state} onChange={change} />
            <FilterSummary
              active={active}
              onChange={change}
              onReset={reset}
              shown={shown.length}
              total={events.length}
              resultsKey={section.results}
              noMatchKey={section.noMatch}
            />
          </Stack>
        )}
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
