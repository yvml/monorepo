// apps/web/src/components/article/ArticleList.tsx
import { Day } from '@/components/date';
import { Listing } from '@/components/listing';
import { localize, t } from '@/i18n';
import { articleListing } from '@/lib/filters';
import { type ArticleSummary } from '@/lib/sanity';

/**
 * The News & Articles listing: `articleListing` over the articles.
 *
 * @param props - the articles.
 * @returns the page.
 */
export function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return (
    <Listing
      title={t('navNews')}
      spec={articleListing}
      basePath="/about/news"
      items={articles}
      context={undefined}
      item={(article) => ({
        id: article._id,
        href: `/about/news/${article.slug}`,
        title: localize(article.title),
        lines: [<Day key="day" iso={article.createdAt.slice(0, 10)} />],
      })}
      empty={t('emptyArticles')}
      results="resultsOfArticles"
      noMatch="noArticlesMatch"
    />
  );
}
