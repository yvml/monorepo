import { Button, Text, Title } from '@hmidmismi/ui';
import Head from 'next/head';
import { withPreviewGate } from '@/lib/gate';

export const getServerSideProps = withPreviewGate();

export default function Home() {
  return (
    <>
      <Head>
        <title>YVML</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Title level="h1">YVML</Title>
        <Text>Edit src/pages/index.tsx to start.</Text>
        <Button>Get started</Button>
      </main>
    </>
  );
}
