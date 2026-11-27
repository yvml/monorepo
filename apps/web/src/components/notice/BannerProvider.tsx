// apps/web/src/components/notice/BannerProvider.tsx
import { createContext, type ReactNode, useContext } from 'react';
import type { Banner } from '@/lib/loaders';

const BannerContext = createContext<Banner | null>(null);

/**
 * Hands the page's banner (what the top band says) to everything under it. The page loader reads it with the rest of the
 * page's data, so the band is in the first paint and nothing shifts when it appears.
 *
 * @param props - the banner, or null for none, and the app.
 * @returns the provider.
 */
export function BannerProvider({ banner, children }: { banner: Banner | null | undefined; children: ReactNode }) {
  return <BannerContext.Provider value={banner ?? null}>{children}</BannerContext.Provider>;
}

/**
 * The banner for this page.
 *
 * @returns the banner, or null when there is none.
 */
export const useBanner = () => useContext(BannerContext);
