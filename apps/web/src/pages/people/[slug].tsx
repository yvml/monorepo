import { CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { Blocks, Hero } from '@/components/ContentModules';
import { SiteLayout } from '@/components/SiteLayout';
import { formatDates, localize } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { getPerson, type PersonDetail } from '@/lib/people';
import { SITE_NAME } from '@/lib/site';

type Props = { person: PersonDetail };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const person = await getPerson(slug, draft);
  return person ? { props: { person } } : { notFound: true };
});

export default function Person({ person }: Props) {
  const name = person.title ?? 'Unnamed';
  const workshops = person.workshops ?? [];

  return (
    <SiteLayout>
      <Head>
        <title>{`${name} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn as="article">
        <PageHeader>
          <Title level="h1">{name}</Title>
          {person.location && <CenteredLines><p>{person.location}</p></CenteredLines>}
        </PageHeader>
        <Hero image={person.portrait} label={`Portrait of ${name}`} />
        <Blocks value={person.biography} />
        {person.links?.length ? (
          <TermList ruled>
            {person.links.map((link) => (
              <TermRow key={link._key} term={link.label}>
                <Link href={link.url}>{link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</Link>
              </TermRow>
            ))}
          </TermList>
        ) : null}
        {workshops.length > 0 && (
          <>
            <Title level="h2">Workshops</Title>
            <ul>
              {workshops.map((workshop) => (
                <li key={workshop._id}>
                  <NextLink href={`/workshops/${workshop.slug}`}>{localize(workshop.title)}</NextLink>
                  {' · '}
                  {formatDates(workshop)}
                  {workshop.status === 'soldOut' && ' · Sold out'}
                </li>
              ))}
            </ul>
          </>
        )}
        {!person.biography?.length && !workshops.length && !person.links?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
