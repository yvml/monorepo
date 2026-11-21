// apps/web/src/components/EventPage.tsx
import { Link, PageColumn, TermList, TermRow, Text } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import { ContentModules } from '@/components/ContentModules';
import { EntryHeader } from '@/components/EntryHeader';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { SiteLayout } from '@/components/SiteLayout';
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
    <SiteLayout title={title}>
      <PageColumn as="article">
        <EntryHeader section={section} id={entry._id} title={title} image={entry.image} attr={attr}>
          {status && <p data-sanity={attr('status')}>{status}</p>}
          <p data-sanity={attr('dateTime')}>{formatDates(entry)}</p>
          {entry.location && <p data-sanity={attr('location')}>{entry.location}</p>}
        </EntryHeader>
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
