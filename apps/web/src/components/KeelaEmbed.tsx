import { EmbedFrame, Link, Text } from '@hmidmismi/ui';
import { keelaFormUrl } from '@/lib/keela';
import { t } from '@/lib/text';

/**
 * A Keela registration form framed in the page, with a link that opens it on its own tab. Keela sends
 * `frame-ancestors *`, so any site may frame it, but it also sends `X-Frame-Options: SAMEORIGIN`; Chrome follows the
 * CSP and frames it, other browsers may not, so the link is always shown. The form is another origin, so the frame
 * cannot size itself to it: it has a fixed shape and scrolls inside. If the live site ever sets a Content-Security-Policy
 * it needs `frame-src https://*.keela.co`. (The newsletter signup is a different Keela form with its own embed script:
 * see `KeelaSignup`.)
 *
 * @param props - the form address and an accessible name for the frame.
 * @returns the frame and the link, or nothing when the address is not a Keela form.
 */
export function KeelaEmbed({ url, title }: { url: unknown; title: string }) {
  const src = keelaFormUrl(url);
  if (!src) return null;

  return (
    <section aria-label={title}>
      <EmbedFrame
        src={src}
        title={title}
        // Scripts and same-origin for the form, popups for the payment providers; no top-level navigation.
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-storage-access-by-user-activation"
      />
      <Text>
        <Link href={src} target="_blank" rel="noopener noreferrer">
          {t('openRegistrationForm')}
        </Link>
      </Text>
    </section>
  );
}
