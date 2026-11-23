import { ItemList, ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { SiteLayout } from '@/components/SiteLayout';
import { SubNav } from '@/components/SubNav';
import { SITE_NAME } from '@/lib/brand';
import { localize } from '@/lib/localize';
import { type ArticleSummary } from '@/lib/sanity';
import { t } from '@/lib/text';

/**
 * The News & Articles listing, newest first.
 *
 * @param props - the articles.
 * @returns the page.
 */
export function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return (
    <SiteLayout>
      <Head>
        <title>{`${t('navNews')} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn>
        <SubNav path="about/news" />
        <ListHeader title={t('navNews')} />
        {!articles.length && <Text>{t('emptyArticles')}</Text>}
        <ItemList>
          {articles.map((article) => (
            <li key={article._id}>
              <NextLink href={`/about/news/${article.slug}`}>{localize(article.title)}</NextLink>
              {' · '}
              {article.createdAt.slice(0, 10)}
            </li>
          ))}
        </ItemList>
      </PageColumn>
    </SiteLayout>
  );
}
