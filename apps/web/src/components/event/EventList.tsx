// apps/web/src/components/event/EventList.tsx
import { Cell, Grid, ItemList, Label, PageColumn, Row, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { Dates } from '@/components/date';
import { FilterBar, FilterSummary } from '@/components/filters';
import { Site, TitleRow } from '@/components/layout';
import { SanityImage } from '@/components/media';
import { type Section } from '@/constants';
import { useFilterState } from '@/hooks';
import { localize, t } from '@/i18n';
import { dateBlock, firstDate, splitByDate } from '@/lib/dates';
import { activeFilters, applyFilters, eventListing } from '@/lib/filters';
import { type EventListProps } from '@/lib/loaders';
import { type EventSummary } from '@/lib/sanity';

function Entries({ entries, section, view }: { entries: EventSummary[]; section: Section; view: string }) {
  if (view === 'grid') {
    return (
      <Grid>
        {entries.map((entry) => (
          <Cell key={entry._id} span="3">
            <Stack gap="1">
              <NextLink href={`/${section.path}/${entry.slug}`}>
                <SanityImage image={entry.image} label={localize(entry.title)} decorative />
                {localize(entry.title)}
              </NextLink>
              <Text variant="small">
                {entry.status === 'cancelled' ? t('cancelled') : entry.status === 'tbc' ? t('toBeConfirmed') : <Dates entry={entry} />}
              </Text>
              {entry.location && <Text variant="small">{entry.location}</Text>}
            </Stack>
          </Cell>
        ))}
      </Grid>
    );
  }
  return (
    <ItemList gap="0" closed>
      {entries.map((entry) => {
        const { month, day } = dateBlock(firstDate(entry));
        return (
          <li key={entry._id}>
            <Row
              layout="dated"
              lead={
                <Stack gap="1">
                  <Label as="div" tone="accent">
                    {month}
                  </Label>
                  <Text as="div" face="display" size="2xl" figures>
                    {day}
                  </Text>
                </Stack>
              }
              title={<NextLink href={`/${section.path}/${entry.slug}`}>{localize(entry.title)}</NextLink>}
              meta={entry.status === 'cancelled' ? t('cancelled') : entry.status === 'tbc' ? t('toBeConfirmed') : <Dates entry={entry} />}
              aside={entry.location}
            />
          </li>
        );
      })}
    </ItemList>
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
        <TitleRow title={t(section.title)} count={upcoming.length ? t('upcomingCount', { count: upcoming.length }) : undefined} />
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
        {upcoming.length > 0 && <Entries entries={upcoming} section={section} view={state.view} />}
        {undated.length > 0 && <Entries entries={undated} section={section} view={state.view} />}
        {past.length > 0 && (
          <>
            <TitleRow title={t('past')} />
            <Entries entries={past} section={section} view={state.view} />
          </>
        )}
      </PageColumn>
    </Site>
  );
}
