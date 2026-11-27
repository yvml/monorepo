// apps/web/src/pages/home/e1.tsx
import Head from 'next/head';
import { HomeE1 } from '@/components/home-e1';
import { type HomeProps, homeLoader } from '@/lib/loaders';

export const getStaticProps = homeLoader;

/** Home E.1, one of the two home designs being tried. */
export default function HomeE1Page({ workshops }: HomeProps) {
  return (
    <>
      <Head>
        <title>YVML · Home E.1</title>
        <meta name="robots" content="noindex" />
      </Head>
      <HomeE1 workshops={workshops} />
    </>
  );
}
