// apps/web/src/components/article/ArticleList.tsx
import { ItemList, PageColumn, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Site, TitleRow } from '@/components/layout';
import { Day } from '@/components/date';
import { localize, t } from '@/i18n';
import { type ArticleSummary } from '@/lib/sanity';

/**
 * The News & Articles listing, newest first.
 *
 * @param props - the articles.
 * @returns the page.
 */
export function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return (
    <Site title={t('navNews')}>
      <PageColumn>
        <TitleRow title={t('navNews')} />
        {!articles.length && <Text>{t('emptyArticles')}</Text>}
        <ItemList>
          {articles.map((article) => (
            <li key={article._id}>
              <NextLink href={`/about/news/${article.slug}`}>{localize(article.title)}</NextLink>
              {' · '}
              <Day iso={article.createdAt.slice(0, 10)} />
            </li>
          ))}
        </ItemList>
      </PageColumn>
    </Site>
  );
}
