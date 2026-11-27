// apps/web/src/components/person/PersonPage.tsx
import { ItemList, Link, Pair, Title } from '@hmidmismi/ui';
import { Blocks } from '@/components/content';
import { DocumentPage } from '@/components/layout';
import { ListingEntries } from '@/components/listing';
import { formatDates } from '@/lib/dates';
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
    <DocumentPage
      title={name}
      lines={[person.location]}
      image={{ value: person.portrait, label: t('portraitOf', { name }) }}
      empty={!person.biography?.length && !workshops.length && !person.links?.length}
    >
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
          <ListingEntries
            view="list"
            items={workshops.map((workshop) => ({
              id: workshop._id,
              href: `/workshops/${workshop.slug}`,
              title: localize(workshop.title),
              lines: [formatDates(workshop), workshop.status === 'soldOut' && t('soldOut')],
            }))}
          />
        </>
      )}
    </DocumentPage>
  );
}
