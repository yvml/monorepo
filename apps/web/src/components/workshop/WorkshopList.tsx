// apps/web/src/components/workshop/WorkshopList.tsx
import { NumberCell, PageColumn, ScrollX, Stack, Table, WrapCell } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { FilterBar, FilterSummary } from '@/components/filters';
import { Site, TitleRow } from '@/components/layout';
import { ImageGrid } from '@/components/media';
import { WORKSHOPS } from '@/constants';
import { useFilterState } from '@/hooks';
import { t } from '@/i18n';
import { activeFilters, applyFilters, workshopListing } from '@/lib/filters';
import { type WorkshopSummary } from '@/lib/sanity';
import { workshopView } from '@/lib/workshop';

/**
 * The workshops listing page: the filter bar for `workshopListing`, the filters that are on as removable chips, the
 * number of matches, and the matches as a grid of cards or a table. The choices live in the address, so a filtered view
 * can be linked.
 *
 * @param props - the workshops and today's date.
 * @returns the page.
 */
export function WorkshopList({ workshops, today }: { workshops: WorkshopSummary[]; today: string }) {
  const context = useMemo(() => ({ today }), [today]);
  const { state, change, reset } = useFilterState(workshopListing, '/workshops');
  const shown = useMemo(() => applyFilters(workshopListing, workshops, state, context), [workshops, state, context]);
  const active = useMemo(() => activeFilters(workshopListing, workshops, state), [workshops, state]);
  const rows = shown.map(workshopView);

  return (
    <Site title={t(WORKSHOPS.title)}>
      <PageColumn>
        <TitleRow title={t(WORKSHOPS.title)} />
        <Stack gap="4">
          <FilterBar spec={workshopListing} items={workshops} context={context} state={state} onChange={change} />
          <FilterSummary
            active={active}
            onChange={change}
            onReset={reset}
            shown={shown.length}
            total={workshops.length}
            resultsKey={WORKSHOPS.results}
            noMatchKey={WORKSHOPS.noMatch}
          />
        </Stack>
        {state.view === 'list' ? (
          <ScrollX>
            <Table.Root>
              <Table.Head>
                <Table.Row>
                  <Table.Header>{t('colWorkshop')}</Table.Header>
                  <Table.Header>{t('colDates')}</Table.Header>
                  <Table.Header>{t('colInstructor')}</Table.Header>
                  <Table.Header>{t('colPrice')}</Table.Header>
                  <Table.Header>{t('colStatus')}</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {rows.map((row) => (
                  <Table.Row key={row.id}>
                    <WrapCell>
                      <NextLink href={row.href}>{row.title}</NextLink>
                    </WrapCell>
                    <WrapCell>{row.dates}</WrapCell>
                    <WrapCell>{row.instructor}</WrapCell>
                    <NumberCell>{row.price}</NumberCell>
                    <WrapCell>{row.status}</WrapCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ScrollX>
        ) : (
          <ImageGrid
            items={rows.map((row) => ({
              id: row.id,
              href: row.href,
              title: row.title,
              image: row.image,
              lines: [row.dates, row.instructor, [row.price, row.status].filter(Boolean).join(' · ')],
            }))}
          />
        )}
      </PageColumn>
    </Site>
  );
}
