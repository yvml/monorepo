// apps/web/src/pages/about/news/index.tsx
import { ArticleList } from '@/components/article';
import { type ArticleListProps, articleListLoader } from '@/lib/loaders';

export const getStaticProps = articleListLoader;

export default function ArticleListRoute({ articles }: ArticleListProps) {
  return <ArticleList articles={articles} />;
}
