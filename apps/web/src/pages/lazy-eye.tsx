import Head from 'next/head';
import NextLink from 'next/link';
import { withPreviewGate } from '@/lib/gate';

export const getServerSideProps = withPreviewGate();

/**
 * Lazy Eye Gallery: a stub. It deliberately skips SiteLayout and the shared UI so the gallery can have its own look.
 *
 * @returns the page.
 */
export default function LazyEye() {
  return (
    <>
      <Head>
        <title>Lazy Eye Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        body { background: #0b0b0b; }
        .lazy-eye { min-height: 100vh; display: grid; place-content: center; gap: 1.5rem; padding: 2rem;
          color: #f2efe6; font-family: 'Courier New', monospace; text-align: center; }
        .lazy-eye h1 { font-size: clamp(2.5rem, 12vw, 8rem); line-height: 0.9; margin: 0; letter-spacing: -0.04em;
          font-weight: 400; text-transform: uppercase; }
        .lazy-eye p { margin: 0; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; }
        .lazy-eye a { color: #f2efe6; }
      `}</style>
      <main className="lazy-eye">
        <h1>Lazy Eye Gallery</h1>
        <p>Coming soon</p>
        <p>
          <NextLink href="/">A project of YVML</NextLink>
        </p>
      </main>
    </>
  );
}
