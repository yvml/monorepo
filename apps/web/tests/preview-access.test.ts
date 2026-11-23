// apps/web/tests/preview-access.test.ts
import { describe, expect, it } from 'vitest';
import { isAllowedEmail, isPublicPath, issuePreviewCredential, previewCookie, verifyPreviewCredential } from '../src/lib/preview/access';

const secret = 'test-secret-with-enough-length-to-be-real';
const now = Date.parse('2026-11-23T12:00:00Z');

describe('the preview credential', () => {
  it('is accepted when this server issued it and it has not expired', async () => {
    const credential = await issuePreviewCredential(secret, now);
    expect(await verifyPreviewCredential(credential, secret, now + 1000)).toBe(true);
  });

  it('is refused for a different secret, a changed expiry, a changed signature, or a missing value', async () => {
    const credential = await issuePreviewCredential(secret, now);
    const [expires, signature] = credential.split('.') as [string, string];
    expect(await verifyPreviewCredential(credential, 'another-secret', now)).toBe(false);
    expect(await verifyPreviewCredential(`${Number(expires) + 3600}.${signature}`, secret, now)).toBe(false);
    expect(await verifyPreviewCredential(`${expires}.${signature.slice(0, -2)}AA`, secret, now)).toBe(false);
    expect(await verifyPreviewCredential(undefined, secret, now)).toBe(false);
    expect(await verifyPreviewCredential(credential, undefined, now)).toBe(false);
  });

  it('is refused once it has expired', async () => {
    const credential = await issuePreviewCredential(secret, now);
    expect(await verifyPreviewCredential(credential, secret, now + 13 * 60 * 60 * 1000)).toBe(false);
  });

  it('is not satisfied by a cookie that is merely present', async () => {
    for (const forged of ['anything', '1.2', 'x.y', '.', '9999999999.@@@']) {
      expect(await verifyPreviewCredential(forged, secret, now)).toBe(false);
    }
  });

  it('is set so the studio iframe can send it in production, and cleared with an empty value', () => {
    expect(previewCookie('abc', true)).toContain('SameSite=None; Secure; Partitioned');
    expect(previewCookie('abc', false)).toContain('SameSite=Lax');
    expect(previewCookie('', true)).toContain('Max-Age=0');
  });
});

describe('public paths', () => {
  it('are matched exactly', () => {
    for (const open of ['/favicon.ico', '/placeholder.svg', '/api/draft-mode/enable', '/api/draft-mode/disable']) {
      expect(isPublicPath(open)).toBe(true);
    }
  });

  it('do not extend to lookalikes, which are pages like any other', () => {
    for (const closed of ['/sign-in', '/sign-in-notes', '/placeholder.svg-notes', '/faviconXico-private', '/favicon.ico/x', '/api/auth/session', '/api/draft-mode/enable-notes', '/', '/about']) {
      expect(isPublicPath(closed)).toBe(false);
    }
  });
});

describe('the allow-list', () => {
  const list = 'jason@example.com, @yvml.org';

  it('lets in a listed address or any address on a listed domain, in any case', () => {
    expect(isAllowedEmail('Jason@Example.com', list)).toBe(true);
    expect(isAllowedEmail('anyone@yvml.org', list)).toBe(true);
  });

  it('refuses everyone else, a lookalike domain, and an empty list', () => {
    expect(isAllowedEmail('other@example.com', list)).toBe(false);
    expect(isAllowedEmail('someone@notyvml.org', list)).toBe(false);
    expect(isAllowedEmail('someone@yvml.org.evil.com', list)).toBe(false);
    expect(isAllowedEmail('jason@example.com', '')).toBe(false);
    expect(isAllowedEmail(undefined, list)).toBe(false);
  });
});
