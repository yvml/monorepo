import { ArticlePage } from '@/components/ArticlePage';
import { type Article, getArticle } from '@/lib/articles';
import { withPreviewGate } from '@/lib/gate';

type Props = { article: Article; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const article = await getArticle(slug, draft);
  return article ? { props: { article } } : { notFound: true };
});

export default function Page({ article, draftMode }: Props) {
  return <ArticlePage article={article} draftMode={draftMode} />;
}
