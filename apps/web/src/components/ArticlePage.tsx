import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import { ContentModules } from '@/components/ContentModules';
import { SiteLayout } from '@/components/SiteLayout';
import { SubNav } from '@/components/SubNav';
import { SITE_NAME } from '@/lib/brand';
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
    <SiteLayout>
      <Head>
        <title>{`${stegaClean(title)} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn as="article">
        <SubNav path="about/news" />
        <PageHeader>
          <Title level="h1">{title}</Title>
          <p>{article.createdAt.slice(0, 10)}</p>
        </PageHeader>
        <div data-sanity={sanityAttr(Boolean(draftMode), article._id, 'article', 'content')}>
          <ContentModules modules={article.content} />
        </div>
        {!article.content?.length && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
