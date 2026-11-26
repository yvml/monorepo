// apps/web/src/components/workshop/WorkshopList.tsx
import { Cell, Grid, PageTable, PageTd, PageTh, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { SanityImage } from '@/components/media';
import { FilterBar, FilterSummary } from '@/components/filters';
import { WORKSHOPS } from '@/constants';
import { Dates } from '@/components/date';
import { activeFilters, applyFilters, workshopListing } from '@/lib/filters';
import { useFilterState } from '@/hooks';
import { localize, t } from '@/i18n';
import { type WorkshopSummary } from '@/lib/sanity';

const names = (workshop: WorkshopSummary) =>
  workshop.instructors?.map((person) => person.title).filter(Boolean).join(', ') ?? '';
const price = (workshop: WorkshopSummary) => (workshop.price == null ? '' : `$${workshop.price}`);
const status = (workshop: WorkshopSummary) => (workshop.status === 'soldOut' ? t('soldOut') : '');

/**
 * The workshop listing: the filter bar for `workshopListing`, the filters that are on as removable chips, the number of
 * matches, and the matches as a grid of cards or a table. The choices live in the address, so a filtered view can be linked.
 *
 * @param props - the workshops and today's date.
 * @returns the listing.
 */
export function WorkshopList({ workshops, today }: { workshops: WorkshopSummary[]; today: string }) {
  const context = useMemo(() => ({ today }), [today]);
  const { state, change, reset } = useFilterState(workshopListing, '/workshops');
  const shown = useMemo(() => applyFilters(workshopListing, workshops, state, context), [workshops, state, context]);
  const active = useMemo(() => activeFilters(workshopListing, workshops, state), [workshops, state]);
  // Computed once per workshop and shared by the table and the grid; `t` is read here so the labels follow the page's language.
  // Nothing here is click-to-edit: a workshop is edited on its own page.
  const rows = shown.map((workshop) => ({
    workshop,
    title: localize(workshop.title),
    href: `/workshops/${workshop.slug}`,
    dates: <Dates entry={workshop} />,
    instructors: names(workshop),
    price: price(workshop),
    status: status(workshop),
    priceAndStatus: price(workshop) && status(workshop),
  }));

  return (
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

      {state.view === 'list' ? (
        <PageTable
          head={
            <>
              <PageTh>{t('colWorkshop')}</PageTh>
              <PageTh>{t('colDates')}</PageTh>
              <PageTh>{t('colInstructor')}</PageTh>
              <PageTh num>{t('colPrice')}</PageTh>
              <PageTh>{t('colStatus')}</PageTh>
            </>
          }
        >
          {rows.map((row) => (
            <tr key={row.workshop._id}>
              <PageTd>
                <NextLink href={row.href}>{row.title}</NextLink>
              </PageTd>
              <PageTd>{row.dates}</PageTd>
              <PageTd>{row.instructors}</PageTd>
              <PageTd num>{row.price}</PageTd>
              <PageTd>{row.status}</PageTd>
            </tr>
          ))}
        </PageTable>
      ) : (
        <Grid>
          {rows.map((row) => (
            <Cell key={row.workshop._id} span="3">
              <Stack gap="1">
                <NextLink href={row.href}>
                  <SanityImage image={row.workshop.image} label={row.title} decorative />
                  {row.title}
                </NextLink>
                <Text variant="small">{row.dates}</Text>
                <Text variant="small">{row.instructors}</Text>
                <Text variant="small">
                  {row.price}
                  {row.priceAndStatus ? ' · ' : ''}
                  {row.status}
                </Text>
              </Stack>
            </Cell>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
