import {
  BreadcrumbTrail,
  CenteredLines,
  Link,
  PageColumn,
  PageHeader,
  TermList,
  TermRow,
  Text,
  Title,
} from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { Blocks, ContentModules, Hero } from '@/components/ContentModules';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { PageTemplate } from '@/components/PageTemplate';
import { nextLink, SiteLayout } from '@/components/SiteLayout';
import { type EventDetail, formatDates, getEntry, localize } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { keelaFormUrl } from '@/lib/keela';
import { getPage, type PageDoc } from '@/lib/pages';
import { type Section, sectionForPath, SITE_NAME } from '@/lib/site';

type Props = { section?: Section; entry?: EventDetail; page?: PageDoc };

const STATUS: Record<string, string> = {
  tbc: 'To be confirmed',
  cancelled: 'Cancelled',
  soldOut: 'Sold out',
};
const FORMAT = { inPerson: 'In person', virtual: 'Virtual', hybrid: 'In person + virtual' } as const;

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const kind = context.params?.kind;
  const slug = context.params?.slug;
  if (typeof kind !== 'string' || typeof slug !== 'string') return { notFound: true };
  const section = sectionForPath(kind);
  if (!section) {
    // Not a listing: a nested static page such as /about/history.
    const page = await getPage(`${kind}/${slug}`, draft);
    return page ? { props: { page } } : { notFound: true };
  }
  const entry = await getEntry(section, slug, draft);
  if (!entry) return { notFound: true };
  return { props: { section, entry } };
});

export default function Entry({ section, entry, page }: Props) {
  if (page) return <PageTemplate page={page} />;
  if (!section || !entry) return null;

  const title = localize(entry.title);
  const status = entry.status ? STATUS[entry.status] : undefined;
  const keela = keelaFormUrl(entry.keelaUrl);
  const types = entry.workshopTypes?.map((term) => localize(term)).join(', ');
  const materials = entry.materials?.map((term) => localize(term)).join(', ');
  const open = entry.status !== 'cancelled' && entry.status !== 'soldOut';
  const hasBody = Boolean(entry.body?.length) || Boolean(entry.content?.length);

  return (
    <SiteLayout>
      <Head>
        <title>{`${title} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn as="article">
        <BreadcrumbTrail
          home={nextLink('/')}
          steps={[
            { key: section.type, label: section.title, link: nextLink(`/${section.path}`) },
            { key: entry._id, label: title, current: true },
          ]}
        />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <CenteredLines>
            {status && <p>{status}</p>}
            <p>{formatDates(entry)}</p>
            {entry.location && <p>{entry.location}</p>}
          </CenteredLines>
        </PageHeader>
        <Hero image={entry.image} label={title} />
        <TermList ruled>
          {entry.instructors?.length ? (
            <TermRow term="Instructors">
              {entry.instructors.map((person, index) => (
                <span key={person._id}>
                  {index > 0 && ', '}
                  {person.slug ? <NextLink href={`/people/${person.slug}`}>{person.title}</NextLink> : person.title}
                </span>
              ))}
            </TermRow>
          ) : null}
          {entry.format && <TermRow term="Format">{FORMAT[entry.format]}</TermRow>}
          {entry.price != null && <TermRow term="Price">{`$${entry.price}`}</TermRow>}
          {entry.scholarshipAvailable && <TermRow term="Scholarship">Full scholarship available</TermRow>}
          {types && <TermRow term="Type">{types}</TermRow>}
          {materials && <TermRow term="Materials">{materials}</TermRow>}
          {!keela && entry.registrationUrl && open && (
            <TermRow term="Registration">
              <Link href={entry.registrationUrl}>Register</Link>
            </TermRow>
          )}
        </TermList>
        <Blocks value={entry.body} />
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={`Register for ${title}`} />}
        {!hasBody && !entry.instructors?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
