/**
 * Accepts a Keela form address from the CMS. Only `https` addresses on `keela.co` are framed, so a bad or malicious
 * value in a document can never put another site (or a `javascript:` URL) on the page.
 *
 * @param value - the stored address.
 * @returns the normalized address, or null when it is missing or not a Keela form.
 */
export function keelaFormUrl(value: unknown) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const onKeela = url.hostname === 'keela.co' || url.hostname.endsWith('.keela.co');
    return url.protocol === 'https:' && onKeela ? url.toString() : null;
  } catch {
    return null;
  }
}

/** The Keela signup form for the newsletter, embedded on the Contact Us page. */
export const NEWSLETTER_URL = 'https://signup-usa.keela.co/embed/TTbspcy6zYvZyPRLf';
