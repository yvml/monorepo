// apps/web/src/components/layout/Page.tsx
import type { ReactNode } from 'react';
import { DocumentContent } from '@/components/content';
import { localize } from '@/i18n';
import { DocumentPage } from './DocumentPage';
import type { PageDoc } from '@/lib/sanity';
import { sanityAttr } from '@/lib/sanity/dataAttribute';

/**
 * A page written in the studio (About, Support, Youth Programs, ...): its title and its content modules in one reading
 * column, inside the site frame. A route that needs something more on its page, such as a form after the text, passes
 * it as children and decides there where it goes.
 *
 * @param props - the page, whether the request is in draft mode, and what the route adds after the content.
 * @returns the page.
 */
export function Page({ page, draftMode, children }: { page: PageDoc; draftMode?: boolean; children?: ReactNode }) {
  return (
    <DocumentPage title={localize(page.title)} empty={!page.content?.length}>
      <DocumentContent modules={page.content} attr={sanityAttr(Boolean(draftMode), page._id, 'page', 'content')} />
      {children}
    </DocumentPage>
  );
}
