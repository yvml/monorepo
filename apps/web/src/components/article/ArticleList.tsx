// apps/web/src/components/article/ArticleList.tsx
import { ItemList, PageColumn, Row, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { Day } from '@/components/date';
import { Site, TitleRow } from '@/components/layout';
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
        <ItemList gap="0" closed>
          {articles.map((article) => (
            <li key={article._id}>
              <Row
                layout="plain"
                title={<NextLink href={`/about/news/${article.slug}`}>{localize(article.title)}</NextLink>}
                meta={<Day iso={article.createdAt.slice(0, 10)} />}
              />
            </li>
          ))}
        </ItemList>
      </PageColumn>
    </Site>
  );
}
