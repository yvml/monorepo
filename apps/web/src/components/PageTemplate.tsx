import { PageColumn, PageHeader, Text, Title } from '@hmidmismi/ui';
import Head from 'next/head';
import { ContentModules } from '@/components/ContentModules';
import { SiteLayout } from '@/components/SiteLayout';
import { localize } from '@/lib/events';
import type { PageDoc } from '@/lib/pages';
import { SITE_NAME } from '@/lib/site';

/**
 * The template for every static page (About, Mission, Youth Programs, Support): a title and the page's content
 * modules in one reading column. Editors control everything below the title from the studio.
 *
 * @param props - the page.
 * @returns the page.
 */
export function PageTemplate({ page }: { page: PageDoc }) {
  const title = localize(page.title);
  return (
    <SiteLayout>
      <Head>
        <title>{`${title} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn as="article">
        <PageHeader>
          <Title level="h1">{title}</Title>
        </PageHeader>
        <ContentModules modules={page.content} />
        {!page.content?.length && <Text>Details to follow.</Text>}
      </PageColumn>
    </SiteLayout>
  );
}
