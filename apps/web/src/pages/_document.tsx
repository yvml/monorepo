import { Head, Html, Main, NextScript } from 'next/document';
import { themeCss } from '@/lib/theme';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style id="theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
