// apps/web/src/pages/_document.tsx
import { THEME_INIT_SCRIPT } from '@hmidmismi/ui';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* Runs before the page is shown, so a visitor who chose dark mode never sees a flash of light. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
