import { Link, Text } from '@hmidmismi/ui';
import { keelaFormUrl } from '@/lib/keela';

/**
 * A Keela registration form framed in the page, with a link that opens it on its own tab. Keela sends
 * `frame-ancestors *`, so any site may frame it, but it also sends `X-Frame-Options: SAMEORIGIN`; Chrome follows the
 * CSP and frames it, other browsers may not, so the link is always shown. The form is a different origin, so the
 * page cannot size the frame to it: it takes most of the viewport and scrolls inside. If the live site ever sets a
 * Content-Security-Policy, it needs `frame-src https://*.keela.co`.
 *
 * @param props - the form address and an accessible name for the frame.
 * @returns the frame and the link, or nothing when the address is not a Keela form.
 */
export function KeelaEmbed({ url, title }: { url: unknown; title: string }) {
  const src = keelaFormUrl(url);
  if (!src) return null;

  return (
    <section aria-label={title}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        // Scripts and same-origin for the form, popups for the payment providers; no top-level navigation.
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-storage-access-by-user-activation"
        // No shared embed frame exists in @hmidmismi/ui yet (VideoFrame is fixed 16:9), hence the inline style.
        style={{ width: '100%', height: '90vh', minHeight: 640, border: 0 }}
      />
      <Text>
        <Link href={src} target="_blank" rel="noopener noreferrer">
          Open the registration form in a new tab
        </Link>
      </Text>
    </section>
  );
}
