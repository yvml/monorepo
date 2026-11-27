// apps/web/src/pages/api/notice.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { bannerLoader } from '@/lib/loaders';

/**
 * What the top band says. Pages are cached, so the browser asks here after the page loads; the answer is cached for a
 * minute, which is as stale as an edit or the start of an event can be.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const banner = await bannerLoader().catch(() => null);
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  res.status(200).json(banner);
}
