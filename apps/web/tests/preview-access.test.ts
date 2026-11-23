// apps/web/tests/preview-access.test.ts
import { describe, expect, it } from 'vitest';
import { isPublicPath, issuePreviewCredential, previewCookie, verifyPreviewCredential } from '../src/lib/preview/access';

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
    expect(previewCookie('abc', true)).toContain('SameSite=None; Secure');
    expect(previewCookie('abc', false)).toContain('SameSite=Lax');
    expect(previewCookie('', true)).toContain('Max-Age=0');
  });
});

describe('public paths', () => {
  it('are matched exactly', () => {
    for (const open of ['/sign-in', '/favicon.ico', '/placeholder.svg', '/api/draft-mode/enable', '/api/draft-mode/disable', '/api/auth/session']) {
      expect(isPublicPath(open)).toBe(true);
    }
  });

  it('do not extend to lookalikes, which are pages like any other', () => {
    for (const closed of ['/sign-in-notes', '/sign-in/extra', '/placeholder.svg-notes', '/faviconXico-private', '/favicon.ico/x', '/api/authx', '/api/draft-mode/enable-notes', '/', '/about']) {
      expect(isPublicPath(closed)).toBe(false);
    }
  });
});
