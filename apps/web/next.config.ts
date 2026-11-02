import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** The shared packages ship TypeScript source, so Next compiles them. */
  transpilePackages: ['@hmidmismi/ui', '@hmidmismi/auth', '@hmidmismi/sanity-types'],
};

export default nextConfig;
