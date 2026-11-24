// apps/web/src/lib/loaders/article.ts
import { slugLoader } from './slug';
import { withDraft } from './static';
import { type ArticleDetail, type ArticleSummary, getArticle, listArticles } from '@/lib/sanity';

/** The News & Articles listing. */
export type ArticleListProps = { articles: ArticleSummary[] };

/** One article. */
export type ArticleProps = { article: ArticleDetail; draftMode?: boolean };

/** The loader for the articles listing. */
export const articleListLoader = withDraft<ArticleListProps>(async (_context, draft) => ({
  props: { articles: await listArticles(draft) },
}));

/** The loader for one article, found by the `slug` in the address. */
export const articleLoader = slugLoader('article', getArticle);
