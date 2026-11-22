// apps/web/src/components/event/EventPage.tsx
import { CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import { ContentModules } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { Site } from '@/components/layout';
import { Breadcrumbs } from '@/components/navigation';
import { Image } from '@/components/media';
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
    <Site title={title}>
      <PageColumn as="article">
        <Breadcrumbs section={section} id={entry._id} title={title} />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <CenteredLines>
            {status && <p data-sanity={attr('status')}>{status}</p>}
            <p>
              <Dates entry={entry} attr={attr('dateTime')} />
            </p>
            {entry.location && <p data-sanity={attr('location')}>{entry.location}</p>}
          </CenteredLines>
        </PageHeader>
        <div data-sanity={attr('image')}>
          <Image image={entry.image} label={title} />
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
    </Site>
  );
}
