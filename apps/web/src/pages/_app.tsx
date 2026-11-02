import '@hmidmismi/ui/styles.css';
import { UiProvider } from '@hmidmismi/ui';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UiProvider gridOverlay={process.env.NODE_ENV === 'development'}>
      <Component {...pageProps} />
      {pageProps.draftMode ? <VisualEditing /> : null}
    </UiProvider>
  );
}
