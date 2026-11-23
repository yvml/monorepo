import { THEME_INIT_SCRIPT } from '@hmidmismi/ui';
import { Head, Html, Main, NextScript } from 'next/document';
import { themeCss } from '@/lib/theme';

export default function Document() {
  return (
    <Html>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style id="theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
