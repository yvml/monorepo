// apps/web/src/components/PageTemplate.tsx
import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import { ContentModules } from '@/components/ContentModules';
import { KeelaSignup } from '@/components/KeelaSignup';
import { SiteLayout } from '@/components/SiteLayout';
import { SubNav } from '@/components/SubNav';
import { NEWSLETTER_URL } from '@/lib/keela';
import { localize } from '@/lib/localize';
import { CONTACT_PATH } from '@/lib/navigation';
import { type PageDoc } from '@/lib/sanity';
import { t } from '@/lib/text';
import { sanityAttr } from '@/lib/visual';

/**
 * The template for every static page (About, Support, Youth Programs, ...): a title, the links to its sibling pages
 * when it sits in a group, and the page's content modules in one reading column. Editors control everything below
 * the title from the studio.
 *
 * @param props - the page, its path without the leading slash, and whether the request is in draft mode.
 * @returns the page.
 */
export function PageTemplate({ page, path, draftMode }: { page: PageDoc; path: string; draftMode?: boolean }) {
  const title = localize(page.title);
  return (
    <SiteLayout title={title}>
      <PageColumn as="article">
        <SubNav path={path} />
        <PageHeader>
          <Title level="h1">{title}</Title>
        </PageHeader>
        <div data-sanity={sanityAttr(Boolean(draftMode), page._id, 'page', 'content')}>
          <ContentModules modules={page.content} />
        </div>
        {!page.content?.length && <Text>{t('detailsToFollow')}</Text>}
        {path === CONTACT_PATH && <KeelaSignup url={NEWSLETTER_URL} title={t('newsletterSignup')} />}
      </PageColumn>
    </SiteLayout>
  );
}
