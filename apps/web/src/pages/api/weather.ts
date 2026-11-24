// apps/web/src/pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { currentWeather } from '@/lib/weather';

/**
 * The current weather, for the header. Pages are cached, so the weather is fetched in the browser from here; the
 * response is cached at the edge for ten minutes, so the weather service is asked about once in that time however many
 * people visit.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const weather = await currentWeather().catch(() => null);
  if (!weather) {
    res.status(502).json(null);
    return;
  }
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
  res.status(200).json(weather);
}
