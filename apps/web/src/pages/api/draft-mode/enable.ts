// apps/web/src/pages/api/draft-mode/enable.ts
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isPreviewSite, safeNext } from '@/lib/preview';
import { issuePreviewCredential, previewCookie } from '@/lib/preview-access';
import { previewClient } from '@/lib/sanity';

/**
 * Called by the studio's Presentation tool. It proves itself with Sanity's one-time secret, then turns on Next's
 * draft mode, gives the editor the signed credential the middleware checks, and redirects to the page being edited.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isPreviewSite || !process.env.SANITY_API_READ_TOKEN) {
    res.status(404).end();
    return;
  }
  const proto = req.headers['x-forwarded-proto'] ?? 'http';
  const { isValid, redirectTo } = await validatePreviewUrl(
    previewClient(),
    `${proto}://${req.headers.host}${req.url}`
  );
  if (!isValid) {
    res.status(401).send('Invalid secret');
    return;
  }
  res.setDraftMode({ enable: true });
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret) {
    // Keep the cookies Next just set and add ours beside them.
    const set = res.getHeader('Set-Cookie');
    const cookies = Array.isArray(set) ? set : set ? [String(set)] : [];
    res.setHeader('Set-Cookie', [...cookies, previewCookie(await issuePreviewCredential(secret))]);
  }
  res.redirect(safeNext(redirectTo));
}
