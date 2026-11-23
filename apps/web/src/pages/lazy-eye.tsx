// apps/web/src/pages/lazy-eye.tsx
import { Link, PageColumn, Text, Title } from '@hmidmismi/ui';
import Head from 'next/head';
import NextLink from 'next/link';
import { t } from '@/i18n';
import { withDraft } from '@/lib/loaders';

export const getStaticProps = withDraft();

/**
 * Lazy Eye Gallery: a placeholder until its design exists. It stands outside the site frame, so the gallery can get its
 * own look later; for now it uses the shared components like everything else. It supplies its own `main` landmark,
 * which the site frame gives every other page.
 *
 * @returns the page.
 */
export default function LazyEye() {
  return (
    <>
      <Head>
        <title>{t('lazyEyeTitle')}</title>
      </Head>
      <main>
        <PageColumn>
          <Title level="h1">{t('lazyEyeTitle')}</Title>
          <Text>{t('comingSoon')}</Text>
          <Text>
            <Link asChild>
              <NextLink href="/">{t('projectOfYvml')}</NextLink>
            </Link>
          </Text>
        </PageColumn>
      </main>
    </>
  );
}
