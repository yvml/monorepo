// apps/web/src/pages/about/news/[slug].tsx
import { ArticlePage } from '@/components/article';
import { type ArticleDetail, getArticle } from '@/lib/sanity';
import { onDemandPaths, withDraft } from '@/lib/loaders';

type Props = { article: ArticleDetail; draftMode?: boolean };

export const getStaticPaths = onDemandPaths;

export const getStaticProps = withDraft<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const article = await getArticle(slug, draft);
  return article ? { props: { article } } : { notFound: true };
});

export default function Page({ article, draftMode }: Props) {
  return <ArticlePage article={article} draftMode={draftMode} />;
}
