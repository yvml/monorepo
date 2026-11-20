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
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import NextLink from 'next/link';
import { ContentModules, Hero } from '@/components/ContentModules';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { PageTemplate } from '@/components/PageTemplate';
import { nextLink, SiteLayout } from '@/components/SiteLayout';
import { type EventDetail, formatDates, getEntry, localize } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { keelaFormUrl } from '@/lib/keela';
import { getPage, type PageDoc } from '@/lib/pages';
import { type Section, sectionForPath, SITE_NAME } from '@/lib/site';
import { sanityAttr } from '@/lib/visual';

type Props = { section?: Section; entry?: EventDetail; page?: PageDoc; draftMode?: boolean };

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

export default function Entry({ section, entry, page, draftMode }: Props) {
  if (page) return <PageTemplate page={page} />;
  if (!section || !entry) return null;

  const title = localize(entry.title);
  /** Makes an element click-to-edit for one field of this document in Presentation. */
  const attr = (path?: string) => sanityAttr(Boolean(draftMode), entry._id, section.docType, path);
  const status = entry.status ? STATUS[entry.status] : undefined;
  const keela = keelaFormUrl(entry.keelaUrl);
  const types = entry.workshopTypes?.map((term) => stegaClean(localize(term))).join(', ');
  const materials = entry.materials?.map((term) => stegaClean(localize(term))).join(', ');
  const open = entry.status !== 'cancelled' && entry.status !== 'soldOut';
  const hasBody = Boolean(entry.content?.length);

  return (
    <SiteLayout>
      <Head>
        <title>{`${stegaClean(title)} · ${SITE_NAME}`}</title>
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
            {status && <p data-sanity={attr('status')}>{status}</p>}
            <p data-sanity={attr('dateTime')}>{formatDates(entry)}</p>
            {entry.location && <p data-sanity={attr('location')}>{entry.location}</p>}
          </CenteredLines>
        </PageHeader>
        <div data-sanity={attr('image')}>
          <Hero image={entry.image} label={title} />
        </div>
        <TermList ruled>
          {entry.instructors?.length ? (
            <TermRow term="Instructors">
              <span data-sanity={attr('instructors')}>
                {entry.instructors.map((person, index) => (
                  <span key={person._id}>
                    {index > 0 && ', '}
                    {person.slug ? (
                      <NextLink href={`/people/${person.slug}`}>{stegaClean(person.title)}</NextLink>
                    ) : (
                      stegaClean(person.title)
                    )}
                  </span>
                ))}
              </span>
            </TermRow>
          ) : null}
          {entry.format && (
            <TermRow term="Format">
              <span data-sanity={attr('format')}>{FORMAT[entry.format]}</span>
            </TermRow>
          )}
          {entry.price != null && (
            <TermRow term="Price">
              <span data-sanity={attr('price')}>{`$${entry.price}`}</span>
            </TermRow>
          )}
          {entry.scholarshipAvailable && (
            <TermRow term="Scholarship">
              <span data-sanity={attr('scholarshipAvailable')}>Full scholarship available</span>
            </TermRow>
          )}
          {types && (
            <TermRow term="Type">
              <span data-sanity={attr('workshopTypes')}>{types}</span>
            </TermRow>
          )}
          {materials && (
            <TermRow term="Materials">
              <span data-sanity={attr('materials')}>{materials}</span>
            </TermRow>
          )}
          {!keela && entry.registrationUrl && open && (
            <TermRow term="Registration">
              <Link href={entry.registrationUrl}>Register</Link>
            </TermRow>
          )}
        </TermList>
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={`Register for ${title}`} />}
        {!hasBody && !entry.instructors?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
