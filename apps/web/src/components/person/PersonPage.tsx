// apps/web/src/components/person/PersonPage.tsx
import { ItemList, Link, PageColumn, Pair, Stack, Text, Title } from '@hmidmismi/ui';
import { CenteredHeader } from '@/components/layout';
import NextLink from 'next/link';
import { Blocks } from '@/components/content';
import { Dates } from '@/components/date';
import { Site } from '@/components/layout';
import { SanityImage } from '@/components/media';
import { localize, t } from '@/i18n';
import type { PersonDetail } from '@/lib/sanity';

/**
 * One person: name, location, portrait, biography, links, and the workshops they teach.
 *
 * @param props - the person.
 * @returns the page.
 */
export function PersonPage({ person }: { person: PersonDetail }) {
  const name = person.title ?? t('unnamed');
  const workshops = person.workshops ?? [];

  return (
    <Site title={name}>
      <PageColumn as="article">
        <CenteredHeader>
          <Title level="h1">{name}</Title>
          {person.location && (
            <Stack gap="1" align="center">
              <p>{person.location}</p>
            </Stack>
          )}
        </CenteredHeader>
        <SanityImage image={person.portrait} label={t('portraitOf', { name })} />
        <Blocks value={person.biography} />
        {person.links?.length ? (
          <ItemList as="dl" layout="pairs" ruled>
            {person.links.map((link) =>
              link.url ? (
                <Pair key={link._key} label={link.label ?? link.url}>
                  <Link href={link.url}>{link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</Link>
                </Pair>
              ) : null
            )}
          </ItemList>
        ) : null}
        {workshops.length > 0 && (
          <>
            <Title level="h2">{t('navWorkshops')}</Title>
            <ItemList>
              {workshops.map((workshop) => (
                <li key={workshop._id}>
                  <NextLink href={`/workshops/${workshop.slug}`}>{localize(workshop.title)}</NextLink>
                  {' · '}
                  <Dates entry={workshop} />
                  {workshop.status === 'soldOut' && ` · ${t('soldOut')}`}
                </li>
              ))}
            </ItemList>
          </>
        )}
        {!person.biography?.length && !workshops.length && !person.links?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
