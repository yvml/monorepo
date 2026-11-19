import { PageColumn, Text, Title } from '@hmidmismi/ui';
import Head from 'next/head';
import { SiteLayout } from '@/components/SiteLayout';
import { withPreviewGate } from '@/lib/gate';

export const getServerSideProps = withPreviewGate();

export default function Home() {
  return (
    <SiteLayout>
      <Head>
        <title>YVML</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn>
        <Title level="h1">YVML</Title>
        <Text>Edit src/pages/index.tsx to start.</Text>
      </PageColumn>
    </SiteLayout>
  );
}
