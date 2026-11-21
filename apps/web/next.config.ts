// apps/web/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** The shared packages ship TypeScript source, so Next compiles them. */
  transpilePackages: ['@hmidmismi/ui', '@hmidmismi/auth', '@hmidmismi/sanity-types'],
  /** English at `/`, Spanish at `/es`. Keep in step with `LOCALES` in `src/lib/locale.ts`. */
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    /** Visitors choose with the switcher; no redirect from the browser's language, so crawlers and Presentation see one URL. */
    localeDetection: false,
  },
};

export default nextConfig;
