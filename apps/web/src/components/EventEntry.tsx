import { BreadcrumbTrail, CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import { ContentModules, Hero } from '@/components/ContentModules';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { nextLink, SiteLayout } from '@/components/SiteLayout';
import { type EventDetail, formatDates, localize } from '@/lib/events';
import { keelaFormUrl } from '@/lib/keela';
import { type Section, SITE_NAME } from '@/lib/site';
import { sanityAttr } from '@/lib/visual';

const STATUS: Record<string, string> = { tbc: 'To be confirmed', cancelled: 'Cancelled' };

/**
 * An event or exhibition page: title, status, dates, location, image, content and the Keela registration form.
 *
 * @param props - the section it belongs to, the entry, and whether the request is in draft mode.
 * @returns the page.
 */
export function EventEntry({ section, entry, draftMode }: { section: Section; entry: EventDetail; draftMode?: boolean }) {
  const title = localize(entry.title);
  const attr = (path?: string) => sanityAttr(Boolean(draftMode), entry._id, 'event', path);
  const status = entry.status ? STATUS[entry.status] : undefined;
  const keela = keelaFormUrl(entry.keelaUrl);
  const open = entry.status !== 'cancelled';

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
        {!keela && entry.registrationUrl && open && (
          <TermList ruled>
            <TermRow term="Registration">
              <Link href={entry.registrationUrl}>Register</Link>
            </TermRow>
          </TermList>
        )}
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={`Register for ${stegaClean(title)}`} />}
        {!entry.content?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
