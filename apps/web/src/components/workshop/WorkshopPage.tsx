// apps/web/src/components/workshop/WorkshopPage.tsx
import { CenteredLines, Link, PageColumn, PageHeader, TermList, TermRow, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { ContentModules } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { Site } from '@/components/layout';
import { Breadcrumbs } from '@/components/navigation';
import { SanityImage } from '@/components/media';
import { WorkshopTerm } from './WorkshopTerm';
import { localize, t } from '@/i18n';
import { WORKSHOPS } from '@/constants';
import { type WorkshopDetail } from '@/lib/sanity';
import { sanityAttr } from '@/lib/sanity/dataAttribute';
import { keelaFormUrl } from '@/lib/keela';

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
    <Site title={title}>
      <PageColumn as="article">
        <Breadcrumbs section={WORKSHOPS} id={entry._id} title={title} />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <CenteredLines>
            {soldOut && <p data-sanity={attr('status')}>{t('soldOut')}</p>}
            <p>
              <Dates entry={entry} attr={attr('dateTime')} />
            </p>
          </CenteredLines>
        </PageHeader>
        <div data-sanity={attr('image')}>
          <SanityImage image={entry.image} label={title} />
        </div>
        <TermList ruled>
          {entry.instructors?.length ? (
            <WorkshopTerm term="termInstructors" field="instructors" attr={attr}>
              {entry.instructors.map((person, index) => (
                <span key={person._id}>
                  {index > 0 && ', '}
                  {person.slug ? <NextLink href={`/people/${person.slug}`}>{stegaClean(person.title)}</NextLink> : stegaClean(person.title)}
                </span>
              ))}
            </WorkshopTerm>
          ) : null}
          {entry.format && (
            <WorkshopTerm term="termFormat" field="format" attr={attr}>
              {t(FORMAT[entry.format])}
            </WorkshopTerm>
          )}
          {entry.price != null && (
            <WorkshopTerm term="termPrice" field="price" attr={attr}>
              {`$${entry.price}`}
            </WorkshopTerm>
          )}
          {entry.scholarshipAvailable && (
            <WorkshopTerm term="termScholarship" field="scholarshipAvailable" attr={attr}>
              {t('scholarshipFull')}
            </WorkshopTerm>
          )}
          {types && (
            <WorkshopTerm term="termType" field="workshopTypes" attr={attr}>
              {types}
            </WorkshopTerm>
          )}
          {materials && (
            <WorkshopTerm term="termMaterials" field="materials" attr={attr}>
              {materials}
            </WorkshopTerm>
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
    </Site>
  );
}
