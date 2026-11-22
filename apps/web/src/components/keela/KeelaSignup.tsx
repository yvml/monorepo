// apps/web/src/components/keela/KeelaSignup.tsx
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { keelaFormUrl } from '@/lib/keela';

/** Keela's own form script and stylesheet. The script frames every `.keela-embed-form`, sizes the frame to the form and watches the page for new ones. */
const KEELA_SCRIPT = 'https://cdn.keela.co/forms/keela-forms.min.js';
const KEELA_CSS = 'https://cdn.keela.co/forms/keela-forms.min.css';

/** The spinner Keela's markup shows until the form is ready. It is set as HTML so React never owns nodes the script removes. */
const LOADING = '<div class="keela-loading"><div></div><div></div><div></div><div></div></div>';

/**
 * A Keela form, such as the newsletter signup, embedded the way Keela supplies it: its script frames the form and
 * resizes the frame as the form changes. The frame is given an accessible name once the script has made it.
 *
 * @param props - the form address and an accessible name for the frame.
 * @returns the form, or nothing when the address is not a Keela form.
 */
export function KeelaSignup({ url, title }: { url: unknown; title: string }) {
  const src = keelaFormUrl(url);
  const box = useRef<HTMLDivElement>(null);
  const name = stegaClean(title);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const label = () => element.querySelector('iframe')?.setAttribute('title', name);
    label();
    const observer = new MutationObserver(label);
    observer.observe(element, { childList: true });
    return () => observer.disconnect();
  }, [name, src]);

  if (!src) return null;

  return (
    <section aria-label={name}>
      <Head>
        <link rel="stylesheet" href={KEELA_CSS} />
      </Head>
      <div ref={box} className="keela-embed-form" data-src={src} dangerouslySetInnerHTML={{ __html: LOADING }} />
      <Script src={KEELA_SCRIPT} strategy="afterInteractive" />
    </section>
  );
}
