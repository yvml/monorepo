// apps/web/src/pages/people/[slug].tsx
import { CenteredLines, ItemList, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Blocks, Hero } from '@/components/ContentModules';
import { SiteLayout } from '@/components/SiteLayout';
import { formatDates } from '@/lib/dates';
import { localize } from '@/lib/localize';
import { getPerson, type PersonDetail } from '@/lib/sanity';
import { t } from '@/lib/text';
import { onDemandPaths, withDraft } from '@/lib/static-props';

type Props = { person: PersonDetail };

export const getStaticPaths = onDemandPaths;

export const getStaticProps = withDraft<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const person = await getPerson(slug, draft);
  return person ? { props: { person } } : { notFound: true };
});

export default function Page({ person }: Props) {
  const name = person.title ?? t('unnamed');
  const workshops = person.workshops ?? [];

  return (
    <SiteLayout title={name}>
      <PageColumn as="article">
        <PageHeader>
          <Title level="h1">{name}</Title>
          {person.location && <CenteredLines><p>{person.location}</p></CenteredLines>}
        </PageHeader>
        <Hero image={person.portrait} label={t('portraitOf', { name })} />
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
                  {formatDates(workshop)}
                  {workshop.status === 'soldOut' && ` · ${t('soldOut')}`}
                </li>
              ))}
            </ItemList>
          </>
        )}
        {!person.biography?.length && !workshops.length && !person.links?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
