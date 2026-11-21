// apps/web/src/components/ArticlePage.tsx
import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import { ContentModules } from '@/components/ContentModules';
import { SiteLayout } from '@/components/SiteLayout';
import { SubNav } from '@/components/SubNav';
import { formatDate } from '@/lib/dates';
import { localize } from '@/lib/localize';
import { type ArticleDetail } from '@/lib/sanity';
import { t } from '@/lib/text';
import { sanityAttr } from '@/lib/visual';

/**
 * One article: title, date and content modules.
 *
 * @param props - the article and whether the request is in draft mode.
 * @returns the page.
 */
export function ArticlePage({ article, draftMode }: { article: ArticleDetail; draftMode?: boolean }) {
  const title = localize(article.title);
  return (
    <SiteLayout title={title}>
      <PageColumn as="article">
        <SubNav path="about/news" />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <p>{formatDate(article.createdAt.slice(0, 10))}</p>
        </PageHeader>
        <div data-sanity={sanityAttr(Boolean(draftMode), article._id, 'article', 'content')}>
          <ContentModules modules={article.content} />
        </div>
        {!article.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
