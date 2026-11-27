// apps/web/src/components/person/PersonList.tsx
import { Listing } from '@/components/listing';
import { t } from '@/i18n';
import { personListing } from '@/lib/filters';
import type { PersonSummary } from '@/lib/sanity';

/**
 * Everyone who has a page: `personListing` over the people.
 *
 * @param props - the people.
 * @returns the page.
 */
export function PersonList({ people }: { people: PersonSummary[] }) {
  return (
    <Listing
      title={t('navPeople')}
      spec={personListing}
      basePath="/people"
      items={people}
      context={undefined}
      item={(person) => ({
        id: person._id,
        href: `/people/${person.slug}`,
        title: person.title ?? '',
        image: person.portrait,
        lines: [person.location],
      })}
      empty={t('emptyPeople')}
      results="resultsOfPeople"
      noMatch="noPeopleMatch"
    />
  );
}
