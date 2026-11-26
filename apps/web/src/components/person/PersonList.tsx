// apps/web/src/components/person/PersonList.tsx
import { Cell, Grid, ItemList, PageColumn, Row, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { FilterBar, FilterSummary } from '@/components/filters';
import { Site, TitleRow } from '@/components/layout';
import { SanityImage } from '@/components/media';
import { useFilterState } from '@/hooks';
import { t } from '@/i18n';
import { activeFilters, applyFilters, personListing } from '@/lib/filters';
import type { PersonSummary } from '@/lib/sanity';

/**
 * Everyone who has a page: a filter bar, then the people that match as a grid of portraits or a list. The choices live in
 * the address, so a filtered view can be linked.
 *
 * @param props - the people.
 * @returns the page.
 */
export function PersonList({ people }: { people: PersonSummary[] }) {
  const { state, change, reset } = useFilterState(personListing, '/people');
  const shown = useMemo(() => applyFilters(personListing, people, state, undefined), [people, state]);
  const active = useMemo(() => activeFilters(personListing, people, state), [people, state]);

  return (
    <Site title={t('navPeople')}>
      <PageColumn>
        <TitleRow title={t('navPeople')} />
        {people.length === 0 ? (
          <Text>{t('emptyPeople')}</Text>
        ) : (
          <Stack gap="4">
            <FilterBar spec={personListing} items={people} context={undefined} state={state} onChange={change} />
            <FilterSummary
              active={active}
              onChange={change}
              onReset={reset}
              shown={shown.length}
              total={people.length}
              resultsKey="resultsOfPeople"
              noMatchKey="noPeopleMatch"
            />
          </Stack>
        )}
        {state.view === 'list' ? (
          <ItemList gap="0" closed>
            {shown.map((person) => (
              <li key={person._id}>
                <Row
                  layout="thumb"
                  lead={<SanityImage image={person.portrait} label={person.title ?? ''} decorative />}
                  title={person.title}
                  meta={person.location ?? undefined}
                  link={(className, content) => (
                    <NextLink className={className} href={`/people/${person.slug}`}>
                      {content}
                    </NextLink>
                  )}
                />
              </li>
            ))}
          </ItemList>
        ) : (
          <Grid>
            {shown.map((person) => (
              <Cell key={person._id} span="3">
                <Stack gap="1">
                  <NextLink href={`/people/${person.slug}`}>
                    <SanityImage image={person.portrait} label={person.title ?? ''} decorative />
                    {person.title}
                  </NextLink>
                  {person.location && <Text variant="small">{person.location}</Text>}
                </Stack>
              </Cell>
            ))}
          </Grid>
        )}
      </PageColumn>
    </Site>
  );
}
