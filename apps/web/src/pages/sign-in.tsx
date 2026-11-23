// apps/web/src/pages/sign-in.tsx
import { authClient } from '@hmidmismi/auth/client';
import { Button, PageColumn, Text, Title } from '@hmidmismi/ui';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SITE_NAME } from '@/constants';
import { t } from '@/i18n';
import { isPreviewSite, safeNext } from '@/lib/preview';

type Props = { next: string };

export const getServerSideProps: GetServerSideProps<Props> = ({ query }) =>
  Promise.resolve(isPreviewSite ? { props: { next: safeNext(query.next) } } : { notFound: true });

export default function SignIn({ next }: Props) {
  return (
    <>
      <Head>
        <title>{`${t('signInTitle')} · ${SITE_NAME} ${t('previewTitle').toLowerCase()}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <PageColumn>
        <Title level="h1">{t('previewTitle')}</Title>
        <Text>{t('signInPrompt')}</Text>
        <Button onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: next })}>
          {t('continueWithGoogle')}
        </Button>
      </PageColumn>
    </>
  );
}
