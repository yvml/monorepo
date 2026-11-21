// apps/web/src/components/WorkshopList.tsx
import {
  CardItem,
  Cell,
  Chip,
  Grid,
  PageTable,
  PageTd,
  PageTh,
  Stack,
  Text,
  Wrap,
} from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { Hero } from '@/components/ContentModules';
import { FilterBar } from '@/components/FilterBar';
import { formatDates } from '@/lib/dates';
import { activeFilters, applyFilters, useFilterState } from '@/lib/filters';
import { localize } from '@/lib/localize';
import { type WorkshopSummary } from '@/lib/sanity';
import { t } from '@/lib/text';
import { sanityAttr } from '@/lib/visual';
import { workshopListing } from '@/lib/workshop-listing';

const names = (workshop: WorkshopSummary) =>
  workshop.instructors?.map((person) => stegaClean(person.title)).filter(Boolean).join(', ') ?? '';
const price = (workshop: WorkshopSummary) => (workshop.price == null ? '' : `$${workshop.price}`);
const status = (workshop: WorkshopSummary) => (workshop.status === 'soldOut' ? t('soldOut') : '');

/**
 * The workshop listing: the filter bar for `workshopListing`, the filters that are on as removable chips, the number of
 * matches, and the matches as a grid of cards or a table. The choices live in the address, so a filtered view can be linked.
 *
 * @param props - the workshops, today's date, and whether the request is in draft mode.
 * @returns the listing.
 */
export function WorkshopList({ workshops, today, draft = false }: { workshops: WorkshopSummary[]; today: string; draft?: boolean }) {
  const context = useMemo(() => ({ today }), [today]);
  const { state, change, reset } = useFilterState(workshopListing, '/workshops');
  const shown = useMemo(() => applyFilters(workshopListing, workshops, state, context), [workshops, state, context]);
  const active = useMemo(() => activeFilters(workshopListing, workshops, state), [workshops, state]);
  /** One field of a workshop, marked for click-to-edit in Presentation. */
  const field = (workshop: WorkshopSummary, path: string, text: string) => (
    <span data-sanity={sanityAttr(draft, workshop._id, 'workshop', path)}>{text}</span>
  );
  // Computed once per workshop and shared by the table and the grid; `t` is read here so the labels follow the page's language.
  const rows = shown.map((workshop) => ({
    workshop,
    title: localize(workshop.title),
    href: `/workshops/${workshop.slug}`,
    dates: field(workshop, 'dateTime', formatDates(workshop)),
    instructors: field(workshop, 'instructors', names(workshop)),
    price: field(workshop, 'price', price(workshop)),
    status: field(workshop, 'status', status(workshop)),
    priceAndStatus: price(workshop) && status(workshop),
  }));

  return (
    <Stack gap="4">
      <FilterBar spec={workshopListing} items={workshops} context={context} state={state} onChange={change} />

      {active.length > 0 && (
        <Wrap gap="2">
          {active.map((filter) => (
            <Chip key={filter.id} removable label={t('removeFilter', { name: filter.label })} onClick={() => change(filter.remove)}>
              {filter.label}
            </Chip>
          ))}
          <Chip onClick={reset}>{t('clearFilters')}</Chip>
        </Wrap>
      )}

      <div aria-live="polite">
        <Text>{t('resultsOfWorkshops', { shown: shown.length, total: workshops.length })}</Text>
      </div>
      {shown.length === 0 && <Text>{t('noWorkshopsMatch')}</Text>}

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
              <CardItem>
                <NextLink href={row.href}>
                  <Hero image={row.workshop.image} label={row.title} decorative />
                  {row.title}
                </NextLink>
                <Text variant="small">{row.dates}</Text>
                <Text variant="small">{row.instructors}</Text>
                <Text variant="small">
                  {row.price}
                  {row.priceAndStatus ? ' · ' : ''}
                  {row.status}
                </Text>
              </CardItem>
            </Cell>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
