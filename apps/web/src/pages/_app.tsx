// apps/web/src/pages/_app.tsx
import '../../styled-system/styles.css';
import { UiProvider } from '@hmidmismi/ui';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BannerProvider } from '@/components/notice';
import { UI_TEXT, setActiveLocale } from '@/i18n';

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  setActiveLocale(locale);
  return (
    <UiProvider text={locale ? UI_TEXT[locale] : undefined} gridOverlay={process.env.NODE_ENV === 'development'}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BannerProvider banner={pageProps.banner}>
        <Component {...pageProps} />
      </BannerProvider>
      {pageProps.draftMode ? <VisualEditing /> : null}
    </UiProvider>
  );
}
