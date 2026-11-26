// apps/web/src/components/event/EventPage.tsx
import { ItemList, Link, PageColumn, Pair, Stack, Text, Title } from '@hmidmismi/ui';
import { CenteredHeader } from '@/components/layout';
import { stegaClean } from '@sanity/client/stega';
import { ContentModules } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { Site } from '@/components/layout';
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
        <CenteredHeader>
          <Title level="h1">{title}</Title>
          <Stack gap="1" align="center">
            {status && <p data-sanity={attr('status')}>{status}</p>}
            <p>
              <Dates entry={entry} attr={attr('dateTime')} />
            </p>
            {entry.location && <p data-sanity={attr('location')}>{entry.location}</p>}
          </Stack>
        </CenteredHeader>
        <div data-sanity={attr('image')}>
          <SanityImage image={entry.image} label={title} />
        </div>
        {!keela && entry.registrationUrl && open && (
          <ItemList as="dl" layout="pairs" ruled>
            <Pair label={t('termRegistration')}>
              <Link href={entry.registrationUrl}>{t('register')}</Link>
            </Pair>
          </ItemList>
        )}
        <ContentModules modules={entry.content} />
        {keela && open && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
        {!entry.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
