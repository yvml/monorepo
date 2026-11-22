// apps/web/src/components/layout/Page.tsx
import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { Site } from './Site';
import { ContentModules } from '@/components/content';
import { localize, t } from '@/i18n';
import type { PageDoc } from '@/lib/sanity';
import { sanityAttr } from '@/lib/visual';

/**
 * A page written in the studio (About, Support, Youth Programs, ...): its title and its content modules in one reading
 * column, inside the site frame. A route that needs something more on its page, such as a form after the text, passes
 * it as children and decides there where it goes.
 *
 * @param props - the page, whether the request is in draft mode, and what the route adds after the content.
 * @returns the page.
 */
export function Page({ page, draftMode, children }: { page: PageDoc; draftMode?: boolean; children?: ReactNode }) {
  const title = localize(page.title);
  return (
    <Site title={title}>
      <PageColumn as="article">
        <PageHeader>
          <Title level="h1">{title}</Title>
        </PageHeader>
        <div data-sanity={sanityAttr(Boolean(draftMode), page._id, 'page', 'content')}>
          <ContentModules modules={page.content} />
        </div>
        {!page.content?.length && <Text>{t('detailsToFollow')}</Text>}
        {children}
      </PageColumn>
    </Site>
  );
}
