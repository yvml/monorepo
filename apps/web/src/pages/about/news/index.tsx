// apps/web/src/pages/about/news/index.tsx
import { ArticleList } from '@/components/article';
import { type ArticleSummary, listArticles } from '@/lib/sanity';
import { withDraft } from '@/lib/loaders';

type Props = { articles: ArticleSummary[] };

export const getStaticProps = withDraft<Props>(async (_context, draft) => ({
  props: { articles: await listArticles(draft) },
}));

export default function Page({ articles }: Props) {
  return <ArticleList articles={articles} />;
}
