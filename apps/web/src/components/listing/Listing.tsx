// apps/web/src/components/listing/Listing.tsx
import { ItemList, PageColumn, Row, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { type ReactNode, useMemo } from 'react';
import { FilterBar, FilterSummary } from '@/components/filters';
import { Header, Site } from '@/components/layout';
import { ImageGrid, SanityImage } from '@/components/media';
import { useFilterState } from '@/hooks';
import { type TextKey } from '@/i18n';
import { activeFilters, applyFilters, type ListSpec } from '@/lib/filters';
import type { ImageData } from '@/lib/sanity';

/** What a listing shows of one entry, whatever the entry is. */
export type ListingItem = {
  id: string;
  href: string;
  title: string;
  image?: ImageData;
  /** Under the title, in the grid, and after it in the list. Empty ones are left out. */
  lines: ReactNode[];
  /** Set to show the entry in the list with this at its start, such as a date block. */
  lead?: ReactNode;
};

/** The entries as they are shown under one heading. */
export type ListingGroup<T> = { title?: string; items: T[] };

type ListingProps<T, C> = {
  /** The page's title, and the text after it, such as a count. */
  title: string;
  count?: string;
  /** How the entries filter, sort and can be shown, and the listing's own path. */
  spec: ListSpec<T, C>;
  basePath: string;
  items: T[];
  context: C;
  /** What to show of one entry. */
  item: (entry: T) => ListingItem;
  /** Splits the entries that match under headings; one group without a heading when left out. */
  groups?: (shown: T[]) => ListingGroup<T>[];
  /** What to say when there are no entries at all, and the keys of the result count and of the no-match text. */
  empty: string;
  results: TextKey;
  noMatch: TextKey;
};

const joined = (lines: ReactNode[]) =>
  lines
    .filter(Boolean)
    .map((line, index) => (
      <span key={index}>
        {index > 0 && ' · '}
        {line}
      </span>
    )) as unknown as ReactNode;

/**
 * Entries as a list of rows or a grid of cards. A listing renders its matches with it, and so can any page that lists
 * a few entries, such as a person's workshops.
 *
 * @param props - the entries and the view, `list` or `grid`.
 * @returns the entries.
 */
export function ListingEntries({ items, view }: { items: ListingItem[]; view: string }) {
  if (view === 'grid') return <ImageGrid items={items} />;
  return (
    <ItemList gap="0" closed>
      {items.map((entry) => (
        <li key={entry.id}>
          <Row
            layout={entry.lead ? 'dated' : 'image' in entry ? 'thumb' : 'plain'}
            lead={entry.lead ?? ('image' in entry ? <SanityImage image={entry.image} label={entry.title} decorative /> : undefined)}
            title={<NextLink href={entry.href}>{entry.title}</NextLink>}
            meta={joined(entry.lines)}
          />
        </li>
      ))}
    </ItemList>
  );
}

/**
 * Every listing of the site: articles, events, exhibitions, people and workshops. It takes the entries, how they filter
 * (`spec`) and what to show of each (`item`), and renders the page: the title, the filter bar, the chips and count, and
 * the matches as a list or a grid, under headings when `groups` splits them. The choices live in the address, so a
 * filtered view can be linked. A listing is a spec and a mapping, not a component.
 *
 * @param props - the entries, their spec, and what to show.
 * @returns the page.
 */
export function Listing<T, C>({ title, count, spec, basePath, items, context, item, groups, empty, results, noMatch }: ListingProps<T, C>) {
  const { state, change, reset } = useFilterState(spec, basePath);
  const shown = useMemo(() => applyFilters(spec, items, state, context), [spec, items, state, context]);
  const active = useMemo(() => activeFilters(spec, items, state), [spec, items, state]);
  const parts = useMemo(() => (groups ? groups(shown) : [{ items: shown }]), [groups, shown]);

  return (
    <Site title={title}>
      <PageColumn>
        <Header title={title} count={count} />
        {items.length === 0 ? (
          <Text>{empty}</Text>
        ) : (
          <Stack gap="4">
            <FilterBar spec={spec} items={items} context={context} state={state} onChange={change} />
            <FilterSummary
              active={active}
              onChange={change}
              onReset={reset}
              shown={shown.length}
              total={items.length}
              resultsKey={results}
              noMatchKey={noMatch}
            />
          </Stack>
        )}
        {parts
          .filter((part) => part.items.length > 0)
          .map((part, index) => (
            <Stack key={part.title ?? index} gap="4">
              {part.title && <Header title={part.title} level="h2" />}
              <ListingEntries items={part.items.map(item)} view={state.view} />
            </Stack>
          ))}
      </PageColumn>
    </Site>
  );
}
