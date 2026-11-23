import { BreadcrumbTrail, CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import { ContentModules, Hero } from '@/components/ContentModules';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { nextLink, SiteLayout } from '@/components/SiteLayout';
import { SITE_NAME } from '@/lib/brand';
import { formatDates } from '@/lib/dates';
import { localize } from '@/lib/localize';
import { type Section } from '@/lib/navigation';
import { type EventDetail } from '@/lib/sanity';
import { keelaFormUrl } from '@/lib/keela';
import { t } from '@/lib/text';
import { sanityAttr } from '@/lib/visual';

const STATUS = { tbc: 'toBeConfirmed', cancelled: 'cancelled' } as const;

/**
 * An event or exhibition page: title, status, dates, location, image, content and the Keela registration form.
 *
 * @param props - the section it belongs to, the entry, and whether the request is in draft mode.
 * @returns the page.
 */
export function EventPage({ section, entry, draftMode }: { section: Section; entry: EventDetail; draftMode?: boolean }) {
  const title = localize(entry.title);
  const attr = (path?: string) => sanityAttr(Boolean(draftMode), entry._id, 'event', path);
  const status = entry.status === 'tbc' || entry.status === 'cancelled' ? t(STATUS[entry.status]) : undefined;
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
            { key: section.type, label: t(section.title), link: nextLink(`/${section.path}`) },
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
            <TermRow term={t('termRegistration')}>
              <Link href={entry.registrationUrl}>{t('register')}</Link>
            </TermRow>
          </TermList>
        )}
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
        {!entry.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
