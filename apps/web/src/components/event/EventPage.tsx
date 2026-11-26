// apps/web/src/components/event/EventPage.tsx
import { ItemList, Link, PageColumn, Text } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import { ContentModules, Term } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { DetailHeader, Site } from '@/components/layout';
import { Breadcrumbs } from '@/components/navigation';
import { SanityImage } from '@/components/media';
import { localize, t } from '@/i18n';
import { type Section } from '@/constants';
import { type EventDetail } from '@/lib/sanity';
import { sanityAttr } from '@/lib/sanity/dataAttribute';
import { keelaFormUrl } from '@/lib/keela';

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
    <Site title={title}>
      <PageColumn as="article">
        <Breadcrumbs section={section} id={entry._id} title={title} />
        <DetailHeader
          title={title}
          lines={[
            status && <span data-sanity={attr('status')}>{status}</span>,
            <Dates key="dates" entry={entry} attr={attr('dateTime')} />,
            entry.location && <span data-sanity={attr('location')}>{entry.location}</span>,
          ]}
        />
        <div data-sanity={attr('image')}>
          <SanityImage image={entry.image} label={title} />
        </div>
        {!keela && entry.registrationUrl && open && (
          <ItemList as="dl" layout="pairs" ruled>
            <Term term="termRegistration">
              <Link href={entry.registrationUrl}>{t('register')}</Link>
            </Term>
          </ItemList>
        )}
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
        {!entry.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
