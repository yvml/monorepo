import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isPreviewSite, safeNext } from '@/lib/preview';
import { previewClient } from '@/lib/sanity';

/**
 * Called by the studio's Presentation tool. It proves itself with Sanity's one-time secret, then turns on Next's
 * draft mode and redirects to the page being edited.
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
  res.redirect(safeNext(redirectTo));
}
