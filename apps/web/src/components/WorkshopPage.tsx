import { BreadcrumbTrail, CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import NextLink from 'next/link';
import { ContentModules, Hero } from '@/components/ContentModules';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { nextLink, SiteLayout } from '@/components/SiteLayout';
import { type Entry, formatDates, localize } from '@/lib/events';
import { keelaFormUrl } from '@/lib/keela';
import { SITE_NAME, WORKSHOPS } from '@/lib/site';
import { sanityAttr } from '@/lib/visual';

const FORMAT = { inPerson: 'In person', virtual: 'Virtual', hybrid: 'In person + virtual' } as const;

/**
 * A workshop page: title, sold-out status, dates, image, instructors (linked to their pages), format, price,
 * scholarship, types, materials, content, and the Keela registration form. In draft mode each field is click-to-edit.
 *
 * @param props - the workshop and whether the request is in draft mode.
 * @returns the page.
 */
export function WorkshopPage({ entry, draftMode }: { entry: Entry; draftMode?: boolean }) {
  const title = localize(entry.title);
  /** Makes an element click-to-edit for one field of this workshop in Presentation. */
  const attr = (path?: string) => sanityAttr(Boolean(draftMode), entry._id, 'workshop', path);
  const soldOut = entry.status === 'soldOut';
  const keela = keelaFormUrl(entry.keelaUrl);
  const types = entry.workshopTypes?.map((term) => stegaClean(localize(term))).join(', ');
  const materials = entry.materials?.map((term) => stegaClean(localize(term))).join(', ');

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
            { key: WORKSHOPS.type, label: WORKSHOPS.title, link: nextLink(`/${WORKSHOPS.path}`) },
            { key: entry._id, label: title, current: true },
          ]}
        />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <CenteredLines>
            {soldOut && <p data-sanity={attr('status')}>Sold out</p>}
            <p data-sanity={attr('dateTime')}>{formatDates(entry)}</p>
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
          {!keela && entry.registrationUrl && !soldOut && (
            <TermRow term="Registration">
              <Link href={entry.registrationUrl}>Register</Link>
            </TermRow>
          )}
        </TermList>
        <ContentModules modules={entry.content} />
        {keela && !soldOut && <KeelaEmbed url={keela} title={`Register for ${stegaClean(title)}`} />}
        {!entry.content?.length && !entry.instructors?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
