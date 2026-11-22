// apps/web/src/components/person/PersonList.tsx
import { CardItem, Cell, Grid, ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Site } from '@/components/layout';
import { Image } from '@/components/media';
import type { PersonSummary } from '@/lib/sanity';
import { t } from '@/lib/text';

/**
 * Everyone who has a page, as cards with their portrait, name and location.
 *
 * @param props - the people.
 * @returns the page.
 */
export function PersonList({ people }: { people: PersonSummary[] }) {
  return (
    <Site title={t('navPeople')}>
      <PageColumn>
        <ListHeader title={t('navPeople')} />
        {!people.length && <Text>{t('emptyPeople')}</Text>}
        <Grid>
          {people.map((person) => (
            <Cell key={person._id} span="3">
              <CardItem>
                <NextLink href={`/people/${person.slug}`}>
                  <Image image={person.portrait} label={person.title ?? ''} decorative />
                  {person.title}
                </NextLink>
                {person.location && <Text variant="small">{person.location}</Text>}
              </CardItem>
            </Cell>
          ))}
        </Grid>
      </PageColumn>
    </Site>
  );
}
