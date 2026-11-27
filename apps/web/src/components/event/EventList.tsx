// apps/web/src/components/event/EventList.tsx
import { Label, Stack, Text } from '@hmidmismi/ui';
import { useMemo } from 'react';
import { Dates } from '@/components/date';
import { Listing } from '@/components/listing';
import { localize, t } from '@/i18n';
import { dateBlock, firstDate, splitByDate } from '@/lib/dates';
import { eventListing } from '@/lib/filters';
import { type EventListProps } from '@/lib/loaders';
import { type EventSummary } from '@/lib/sanity';

const whenOf = (entry: EventSummary) =>
  entry.status === 'cancelled' ? t('cancelled') : entry.status === 'tbc' ? t('toBeConfirmed') : <Dates entry={entry} />;

/**
 * The events or exhibitions listing: `eventListing` over the entries, upcoming first, then undated, then past (hidden
 * until asked for).
 *
 * @param props - the section, its entries, and today's date.
 * @returns the page.
 */
export function EventList({ section, events, today }: EventListProps) {
  const context = useMemo(() => ({ today }), [today]);
  const upcomingCount = useMemo(() => splitByDate(events, today).upcoming.length, [events, today]);
  const groups = useMemo(
    () => (shown: EventSummary[]) => {
      const { upcoming, undated, past } = splitByDate(shown, today);
      return [{ items: upcoming }, { items: undated }, { title: t('past'), items: past }];
    },
    [today]
  );
  return (
    <Listing
      title={t(section.title)}
      count={upcomingCount ? t('upcomingCount', { count: upcomingCount }) : undefined}
      spec={eventListing}
      basePath={`/${section.path}`}
      items={events}
      context={context}
      groups={groups}
      item={(entry) => {
        const { month, day } = dateBlock(firstDate(entry));
        return {
          id: entry._id,
          href: `/${section.path}/${entry.slug}`,
          title: localize(entry.title),
          image: entry.image,
          lead: (
            <Stack gap="1">
              <Label as="div" tone="accent">
                {month}
              </Label>
              <Text as="div" face="display" size="2xl" figures>
                {day}
              </Text>
            </Stack>
          ),
          lines: [whenOf(entry), entry.location],
        };
      }}
      empty={t(section.empty)}
      results={section.results}
      noMatch={section.noMatch}
    />
  );
}
