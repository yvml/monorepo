// apps/web/src/components/WorkshopPage.tsx
import { Link, PageColumn, TermList, TermRow, Text } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { ContentModules } from '@/components/ContentModules';
import { EntryHeader } from '@/components/EntryHeader';
import { KeelaEmbed } from '@/components/KeelaEmbed';
import { SiteLayout } from '@/components/SiteLayout';
import { formatDates } from '@/lib/dates';
import { localize } from '@/lib/localize';
import { WORKSHOPS } from '@/lib/navigation';
import { type WorkshopDetail } from '@/lib/sanity';
import { keelaFormUrl } from '@/lib/keela';
import { t } from '@/lib/text';
import { sanityAttr } from '@/lib/visual';

const FORMAT = { inPerson: 'formatInPerson', virtual: 'formatVirtual', hybrid: 'formatHybrid' } as const;

/**
 * A workshop page: title, sold-out status, dates, image, instructors (linked to their pages), format, price,
 * scholarship, types, materials, content, and the Keela registration form. In draft mode each field is click-to-edit.
 *
 * @param props - the workshop and whether the request is in draft mode.
 * @returns the page.
 */
export function WorkshopPage({ entry, draftMode }: { entry: WorkshopDetail; draftMode?: boolean }) {
  const title = localize(entry.title);
  /** Makes an element click-to-edit for one field of this workshop in Presentation. */
  const attr = (path?: string) => sanityAttr(Boolean(draftMode), entry._id, 'workshop', path);
  const soldOut = entry.status === 'soldOut';
  const keela = keelaFormUrl(entry.keelaUrl);
  const types = entry.workshopTypes?.map((term) => stegaClean(localize(term))).join(', ');
  const materials = entry.materials?.map((term) => stegaClean(localize(term))).join(', ');

  return (
    <SiteLayout title={title}>
      <PageColumn as="article">
        <EntryHeader section={WORKSHOPS} id={entry._id} title={title} image={entry.image} attr={attr}>
          {soldOut && <p data-sanity={attr('status')}>{t('soldOut')}</p>}
          <p data-sanity={attr('dateTime')}>{formatDates(entry)}</p>
        </EntryHeader>
        <TermList ruled>
          {entry.instructors?.length ? (
            <TermRow term={t('termInstructors')}>
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
            <TermRow term={t('termFormat')}>
              <span data-sanity={attr('format')}>{t(FORMAT[entry.format])}</span>
            </TermRow>
          )}
          {entry.price != null && (
            <TermRow term={t('termPrice')}>
              <span data-sanity={attr('price')}>{`$${entry.price}`}</span>
            </TermRow>
          )}
          {entry.scholarshipAvailable && (
            <TermRow term={t('termScholarship')}>
              <span data-sanity={attr('scholarshipAvailable')}>{t('scholarshipFull')}</span>
            </TermRow>
          )}
          {types && (
            <TermRow term={t('termType')}>
              <span data-sanity={attr('workshopTypes')}>{types}</span>
            </TermRow>
          )}
          {materials && (
            <TermRow term={t('termMaterials')}>
              <span data-sanity={attr('materials')}>{materials}</span>
            </TermRow>
          )}
          {!keela && entry.registrationUrl && !soldOut && (
            <TermRow term={t('termRegistration')}>
              <Link href={entry.registrationUrl}>{t('register')}</Link>
            </TermRow>
          )}
        </TermList>
        <ContentModules modules={entry.content} />
        {keela && !soldOut && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
        {!entry.content?.length && !entry.instructors?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
