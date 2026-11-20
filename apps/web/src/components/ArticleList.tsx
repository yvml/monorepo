import { ListHeader, PageColumn, Text } from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { SiteLayout } from '@/components/SiteLayout';
import { SubNav } from '@/components/SubNav';
import type { ArticleSummary } from '@/lib/articles';
import { localize } from '@/lib/events';
import { SITE_NAME } from '@/lib/site';

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
        <title>{`News & Articles · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn>
        <SubNav path="about/news" />
        <ListHeader title="News & Articles" />
        {!articles.length && <Text>No articles are listed.</Text>}
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <NextLink href={`/about/news/${article.slug}`}>{localize(article.title)}</NextLink>
              {' · '}
              {article.createdAt.slice(0, 10)}
            </li>
          ))}
        </ul>
      </PageColumn>
    </SiteLayout>
  );
}
