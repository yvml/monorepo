import '@hmidmismi/ui/styles.css';
import { UiProvider } from '@hmidmismi/ui';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { setActiveLocale } from '@/lib/locale';

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  setActiveLocale(locale);
  return (
    <UiProvider gridOverlay={process.env.NODE_ENV === 'development'}>
      <Component {...pageProps} />
      {pageProps.draftMode ? <VisualEditing /> : null}
    </UiProvider>
  );
}
