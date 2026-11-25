// apps/web/src/pages/home/c.tsx
import Head from 'next/head';
import { HomeC } from '@/components/home-c';
import { type HomeProps, homeLoader } from '@/lib/loaders';

export const getStaticProps = homeLoader;

/** Home C, one of the two home designs being tried. */
export default function HomeCPage({ workshops }: HomeProps) {
  return (
    <>
      <Head>
        <title>YVML · Home C</title>
        <meta name="robots" content="noindex" />
      </Head>
      <HomeC workshops={workshops} />
    </>
  );
}
