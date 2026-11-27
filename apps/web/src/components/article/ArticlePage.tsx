// apps/web/src/components/article/ArticlePage.tsx
import { DocumentContent } from '@/components/content';
import { Day } from '@/components/date';
import { DocumentPage } from '@/components/layout';
import { localize } from '@/i18n';
import { type ArticleDetail } from '@/lib/sanity';
import { sanityAttr } from '@/lib/sanity/dataAttribute';

/**
 * One article: title, date and content modules.
 *
 * @param props - the article and whether the request is in draft mode.
 * @returns the page.
 */
export function ArticlePage({ article, draftMode }: { article: ArticleDetail; draftMode?: boolean }) {
  return (
    <DocumentPage
      title={localize(article.title)}
      lines={[<Day key="day" iso={article.createdAt.slice(0, 10)} />]}
      empty={!article.content?.length}
    >
      <DocumentContent modules={article.content} attr={sanityAttr(Boolean(draftMode), article._id, 'article', 'content')} />
    </DocumentPage>
  );
}
