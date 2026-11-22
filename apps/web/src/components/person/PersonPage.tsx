// apps/web/src/components/person/PersonPage.tsx
import { CenteredLines, ItemList, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Blocks } from '@/components/content';
import { Dates } from '@/components/date';
import { Site } from '@/components/layout';
import { Image } from '@/components/media';
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
        <PageHeader>
          <Title level="h1">{name}</Title>
          {person.location && (
            <CenteredLines>
              <p>{person.location}</p>
            </CenteredLines>
          )}
        </PageHeader>
        <Image image={person.portrait} label={t('portraitOf', { name })} />
        <Blocks value={person.biography} />
        {person.links?.length ? (
          <TermList ruled>
            {person.links.map((link) =>
              link.url ? (
                <TermRow key={link._key} term={link.label ?? link.url}>
                  <Link href={link.url}>{link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</Link>
                </TermRow>
              ) : null
            )}
          </TermList>
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
