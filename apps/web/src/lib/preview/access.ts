// apps/web/src/lib/preview/access.ts
// Who may see the private preview site, apart from the Clerk login itself. It runs in the middleware and in the
// draft-mode route handlers, so it uses Web Crypto only.

/** The cookie that proves an editor came in through the studio's Presentation tool. */
export const PREVIEW_COOKIE = 'yvml_preview';

/** How long a preview credential lasts, in seconds. */
const MAX_AGE = 60 * 60 * 12;

const encoder = new TextEncoder();

const signingKey = (secret: string) =>
  crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

const payload = (expires: number) => encoder.encode(`yvml-preview:${expires}`);

const toBase64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (text: string) => {
  try {
    const padded = text.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(text.length / 4) * 4, '=');
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
};

/**
 * The secret credentials are signed with: `PREVIEW_COOKIE_SECRET`, at least 32 characters. A shorter one counts as none,
 * so nothing can be issued or verified.
 */
export const previewSecret = () => {
  const secret = process.env.PREVIEW_COOKIE_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
};

/**
 * A credential that says the holder passed the studio's one-time secret check: an expiry time and an HMAC of it, made
 * with a secret only the server knows. The studio's iframe cannot carry a Clerk session (a third-party cookie, and
 * Clerk's sign-in page refuses to be framed), so this is how an editor in Presentation gets in.
 *
 * @param secret - the server's signing secret.
 * @param now - the current time in milliseconds.
 * @returns the credential, to be set as the `PREVIEW_COOKIE` value.
 */
export async function issuePreviewCredential(secret: string, now = Date.now()) {
  const expires = Math.floor(now / 1000) + MAX_AGE;
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), payload(expires));
  return `${expires}.${toBase64Url(signature)}`;
}

/**
 * Whether a credential is genuine and has not expired. Without a secret nothing can be verified, so nothing passes.
 *
 * @param value - the cookie value.
 * @param secret - the server's signing secret.
 * @param now - the current time in milliseconds.
 * @returns true when the credential was issued by this server and is still valid.
 */
export async function verifyPreviewCredential(value: string | undefined, secret: string | undefined, now = Date.now()) {
  if (!value || !secret) return false;
  const [expiresText, signatureText] = value.split('.');
  const expires = Number(expiresText);
  const signature = signatureText ? fromBase64Url(signatureText) : null;
  if (!signature || !Number.isInteger(expires) || expires * 1000 < now) return false;
  return crypto.subtle.verify('HMAC', await signingKey(secret), signature, payload(expires));
}

/**
 * The `Set-Cookie` header for a credential. It is sent to the studio's iframe, so in production it is `SameSite=None;
 * Secure; Partitioned`: the browser only sends it inside that iframe.
 *
 * @param value - the credential, or an empty string to clear it.
 * @param production - whether this is a production build.
 * @returns the header value.
 */
export function previewCookie(value: string, production = process.env.NODE_ENV === 'production') {
  const attributes = ['Path=/', 'HttpOnly', value ? `Max-Age=${MAX_AGE}` : 'Max-Age=0', production ? 'SameSite=None' : 'SameSite=Lax'];
  if (production) attributes.push('Secure', 'Partitioned');
  return `${PREVIEW_COOKIE}=${value}; ${attributes.join('; ')}`;
}

/**
 * Whether an email may see the preview site, from `PREVIEW_ALLOWED_EMAILS`: comma-separated addresses and `@domain`
 * entries, such as `jason@example.com, @yvml.org`. Empty or unset lets nobody in.
 *
 * @param email - the signed-in person's primary email.
 * @param list - the allow-list; defaults to the environment's.
 * @returns true when the address or its domain is listed.
 */
export function isAllowedEmail(email: string | undefined | null, list = process.env.PREVIEW_ALLOWED_EMAILS ?? '') {
  if (!email) return false;
  const address = email.trim().toLowerCase();
  const domain = address.slice(address.lastIndexOf('@'));
  return list
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) => (entry.startsWith('@') ? entry === domain : entry === address));
}

/** The routes open to everyone on the preview site: the draft-mode routes, which check the studio's secret themselves, and two static files. Exact paths only. */
const PUBLIC_PATHS = new Set(['/api/draft-mode/enable', '/api/draft-mode/disable', '/favicon.ico', '/placeholder.svg']);

/**
 * Whether a path is open to everyone on the preview site. The match is exact, so `/placeholder.svg-notes` is a page like
 * any other and needs a login. The language prefix is already gone from `request.nextUrl.pathname`.
 *
 * @param pathname - the request's path.
 * @returns true for the public routes.
 */
export const isPublicPath = (pathname: string) => PUBLIC_PATHS.has(pathname);
