// apps/web/src/pages/about/news/[slug].tsx
import { ArticlePage } from '@/components/article';
import { type ArticleProps, articleLoader, onDemandPaths } from '@/lib/loaders';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = articleLoader;

export default function ArticleRoute({ article, draftMode }: ArticleProps) {
  return <ArticlePage article={article} draftMode={draftMode} />;
}
