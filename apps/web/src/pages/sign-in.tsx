import { authClient } from '@hmidmismi/auth/client';
import { Button, Text, Title } from '@hmidmismi/ui';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { isPreviewSite, safeNext } from '@/lib/preview';

type Props = { next: string };

export const getServerSideProps: GetServerSideProps<Props> = ({ query }) =>
  Promise.resolve(isPreviewSite ? { props: { next: safeNext(query.next) } } : { notFound: true });

export default function SignIn({ next }: Props) {
  return (
    <>
      <Head>
        <title>Sign in · YVML preview</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main>
        <Title level="h1">Preview</Title>
        <Text>Sign in with your Google account to see the preview site.</Text>
        <Button onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: next })}>
          Continue with Google
        </Button>
      </main>
    </>
  );
}
