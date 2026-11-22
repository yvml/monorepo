// apps/web/src/components/article/ArticlePage.tsx
import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import { ContentModules } from '@/components/content';
import { Site } from '@/components/layout';
import { Day } from '@/components/date';
import { localize, t } from '@/i18n';
import { type ArticleDetail } from '@/lib/sanity';
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
    <Site title={title}>
      <PageColumn as="article">
        <PageHeader>
          <Title level="h1">{title}</Title>
          <p>
            <Day iso={article.createdAt.slice(0, 10)} />
          </p>
        </PageHeader>
        <div data-sanity={sanityAttr(Boolean(draftMode), article._id, 'article', 'content')}>
          <ContentModules modules={article.content} />
        </div>
        {!article.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
