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
  /** Click-to-edit for one field of a workshop in Presentation. */
  const at = (workshop: WorkshopSummary, path?: string) => sanityAttr(draft, workshop._id, 'workshop', path);

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
          {shown.map((workshop) => (
            <tr key={workshop._id}>
              <PageTd>
                <NextLink href={`/workshops/${workshop.slug}`}>{localize(workshop.title)}</NextLink>
              </PageTd>
              <PageTd>
                <span data-sanity={at(workshop, 'dateTime')}>{formatDates(workshop)}</span>
              </PageTd>
              <PageTd>
                <span data-sanity={at(workshop, 'instructors')}>{names(workshop)}</span>
              </PageTd>
              <PageTd num>
                <span data-sanity={at(workshop, 'price')}>{price(workshop)}</span>
              </PageTd>
              <PageTd>
                <span data-sanity={at(workshop, 'status')}>{status(workshop)}</span>
              </PageTd>
            </tr>
          ))}
        </PageTable>
      ) : (
        <Grid>
          {shown.map((workshop) => (
            <Cell key={workshop._id} span="3">
              <CardItem>
                <NextLink href={`/workshops/${workshop.slug}`}>
                  <Hero image={workshop.image} label={localize(workshop.title)} decorative />
                  {localize(workshop.title)}
                </NextLink>
                <Text variant="small">
                  <span data-sanity={at(workshop, 'dateTime')}>{formatDates(workshop)}</span>
                </Text>
                <Text variant="small">
                  <span data-sanity={at(workshop, 'instructors')}>{names(workshop)}</span>
                </Text>
                <Text variant="small">
                  <span data-sanity={at(workshop, 'price')}>{price(workshop)}</span>
                  {price(workshop) && status(workshop) ? ' · ' : ''}
                  <span data-sanity={at(workshop, 'status')}>{status(workshop)}</span>
                </Text>
              </CardItem>
            </Cell>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
