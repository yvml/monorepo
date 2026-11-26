// apps/web/src/components/workshop/WorkshopPage.tsx
import { ItemList, Link, PageColumn, Text } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { ContentModules, Term } from '@/components/content';
import { KeelaEmbed } from '@/components/keela';
import { Dates } from '@/components/date';
import { Header, Site } from '@/components/layout';
import { Breadcrumbs } from '@/components/navigation';
import { SanityImage } from '@/components/media';
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
        <Header
          align="center"
          title={title}
          lines={[soldOut && <span data-sanity={attr('status')}>{t('soldOut')}</span>, <Dates key="dates" entry={entry} attr={attr('dateTime')} />]}
        />
        <div data-sanity={attr('image')}>
          <SanityImage image={entry.image} label={title} />
        </div>
        <ItemList as="dl" layout="pairs" ruled>
          {entry.instructors?.length ? (
            <Term term="termInstructors" attr={attr('instructors')}>
              {entry.instructors.map((person, index) => (
                <span key={person._id}>
                  {index > 0 && ', '}
                  {person.slug ? <NextLink href={`/people/${person.slug}`}>{stegaClean(person.title)}</NextLink> : stegaClean(person.title)}
                </span>
              ))}
            </Term>
          ) : null}
          {entry.format && (
            <Term term="termFormat" attr={attr('format')}>
              {t(FORMAT[entry.format])}
            </Term>
          )}
          {entry.price != null && (
            <Term term="termPrice" attr={attr('price')}>
              {`$${entry.price}`}
            </Term>
          )}
          {entry.scholarshipAvailable && (
            <Term term="termScholarship" attr={attr('scholarshipAvailable')}>
              {t('scholarshipFull')}
            </Term>
          )}
          {types && (
            <Term term="termType" attr={attr('workshopTypes')}>
              {types}
            </Term>
          )}
          {materials && (
            <Term term="termMaterials" attr={attr('materials')}>
              {materials}
            </Term>
          )}
          {!keela && entry.registrationUrl && !soldOut && (
            <Term term="termRegistration">
              <Link href={entry.registrationUrl}>{t('register')}</Link>
            </Term>
          )}
        </ItemList>
        <ContentModules modules={entry.content} />
        {keela && !soldOut && <KeelaEmbed url={keela} title={t('registerFor', { title: stegaClean(title) })} />}
        {!entry.content?.length && !entry.instructors?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
