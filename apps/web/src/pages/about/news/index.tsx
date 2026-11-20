import { ArticleList } from '@/components/ArticleList';
import { type ArticleSummary, listArticles } from '@/lib/articles';
import { withPreviewGate } from '@/lib/gate';

type Props = { articles: ArticleSummary[] };

export const getServerSideProps = withPreviewGate<Props>(async (_context, draft) => ({
  props: { articles: await listArticles(draft) },
}));

export default function Page({ articles }: Props) {
  return <ArticleList articles={articles} />;
}
