import type { NextApiRequest, NextApiResponse } from 'next';
import { isPreviewSite } from '@/lib/preview';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!isPreviewSite) {
    res.status(404).end();
    return;
  }
  res.setDraftMode({ enable: false });
  res.redirect('/');
}
