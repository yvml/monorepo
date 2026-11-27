// apps/web/src/lib/filters/article.ts
import type { ListSpec } from './types';
import { localize } from '@/i18n';
import type { ArticleSummary } from '@/lib/sanity';

/**
 * How the articles listing filters and shows articles: a search over the title, as a list or a grid. The loader puts the
 * newest first, so there is one order and no sort control.
 */
export const articleListing: ListSpec<ArticleSummary> = {
  filters: [{ kind: 'search', key: 'q', label: 'filterSearch', text: (article) => localize(article.title) }],
  sorts: [{ value: 'newest', label: 'sortNewest', compare: () => 0 }],
  defaultSort: 'newest',
  defaultView: 'list',
  views: [
    { value: 'list', label: 'viewList' },
    { value: 'grid', label: 'viewGrid' },
  ],
};
