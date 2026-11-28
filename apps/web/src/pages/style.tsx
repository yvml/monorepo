// apps/web/src/pages/style.tsx
import { PageColumn, StyleBook } from '@hmidmismi/ui';
import Head from 'next/head';
import { Site } from '@/components/layout';
import { showDesignTools } from '@/lib/preview/flags';
import { withDraft } from '@/lib/loaders';

/** The style book answers 404 on the live site, and shows on the preview site and in development. */
export const getStaticProps = withDraft(() => (showDesignTools ? { props: {} } : { notFound: true }));

/**
 * The style book: the design system's type scale, columns, spacing, rows and controls drawn in this site's own theme and
 * grid mode, so a change to either can be seen. The content is the design system's `StyleBook`; the page only frames it.
 *
 * @returns the page.
 */
export default function StylePage() {
  return (
    <Site subNav={false}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <PageColumn>
        <StyleBook />
      </PageColumn>
    </Site>
  );
}
