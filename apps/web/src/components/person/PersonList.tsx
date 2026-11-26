// apps/web/src/components/person/PersonList.tsx
import { Cell, Grid, PageColumn, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Site, TitleRow } from '@/components/layout';
import { SanityImage } from '@/components/media';
import { t } from '@/i18n';
import type { PersonSummary } from '@/lib/sanity';

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
        <TitleRow title={t('navPeople')} />
        {!people.length && <Text>{t('emptyPeople')}</Text>}
        <Grid>
          {people.map((person) => (
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
      </PageColumn>
    </Site>
  );
}
