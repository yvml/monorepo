// apps/web/next.config.ts
import type { NextConfig } from 'next';
import { requireLogin } from './src/lib/preview/flags';

const PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** The preview flag is read in the browser too (the grid overlay is mounted by it), so it is written into the client build. */
  env: { PREVIEW_SITE: process.env.PREVIEW_SITE ?? 'false' },
  /** Sanity's images are served through Next so the page may read their pixels (the home's duotones are made in a canvas). */
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  /** The shared packages ship TypeScript source, so Next compiles them. */
  transpilePackages: ['@hmidmismi/ui', '@hmidmismi/sanity-types'],
  /**
   * `src/proxy.preview.ts` (the Clerk login) is only picked up as the proxy when `preview.ts` is a page extension,
   * which it is for the gated preview site alone. Every other build, the live site and the pull request previews, has no
   * proxy at all.
   */
  pageExtensions: requireLogin ? [...PAGE_EXTENSIONS, 'preview.ts'] : PAGE_EXTENSIONS,
  /** English at `/`, Spanish at `/es`. Keep in step with `LOCALES` in `src/i18n/locale.ts`. */
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    /** Visitors choose with the switcher; no redirect from the browser's language, so crawlers and Presentation see one URL. */
    localeDetection: false,
  },
};

export default nextConfig;
