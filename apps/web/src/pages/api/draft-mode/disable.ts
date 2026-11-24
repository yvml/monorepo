// apps/web/src/pages/api/draft-mode/disable.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { isPreviewSite } from '@/lib/preview/flags';
import { previewCookie } from '@/lib/preview/access';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!isPreviewSite) {
    res.status(404).end();
    return;
  }
  res.setDraftMode({ enable: false });
  const set = res.getHeader('Set-Cookie');
  const cookies = Array.isArray(set) ? set : set ? [String(set)] : [];
  res.setHeader('Set-Cookie', [...cookies, previewCookie('')]);
  res.redirect('/');
}
