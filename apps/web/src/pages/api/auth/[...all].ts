// apps/web/src/pages/api/auth/[...all].ts
import { toNodeHandler } from 'better-auth/node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@/lib/preview/auth';
import { isPreviewSite } from '@/lib/preview/flags';

/** Better Auth's endpoints need the raw request body. */
export const config = { api: { bodyParser: false } };

/** Only the preview site has sign-in; on the live site this route does not exist. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isPreviewSite) {
    res.status(404).end();
    return;
  }
  const { auth, close } = getAuth();
  try {
    await toNodeHandler(auth)(req, res);
  } finally {
    await close();
  }
}
