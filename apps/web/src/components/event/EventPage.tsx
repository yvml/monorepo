// apps/web/src/components/event/EventPage.tsx
import { ItemList, Link } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import { DocumentContent, Term } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { DocumentPage } from '@/components/layout';
import { Breadcrumbs } from '@/components/navigation';
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
    <DocumentPage
      title={title}
      breadcrumbs={<Breadcrumbs section={section} id={entry._id} title={title} />}
      lines={[
        status && <span data-sanity={attr('status')}>{status}</span>,
        <Dates key="dates" entry={entry} attr={attr('dateTime')} />,
        entry.location && <span data-sanity={attr('location')}>{entry.location}</span>,
      ]}
      image={{ value: entry.image, label: title, attr: attr('image') }}
      empty={!entry.content?.length}
    >
      {!keela && entry.registrationUrl && open && (
        <ItemList as="dl" layout="pairs" ruled>
          <Term term="termRegistration">
            <Link href={entry.registrationUrl}>{t('register')}</Link>
          </Term>
        </ItemList>
      )}
      <DocumentContent modules={entry.content} attr={attr('content')} />
      {keela && open && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
    </DocumentPage>
  );
}
