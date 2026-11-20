import { defineCliConfig } from '@sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: 'yvml',
  deployment: {
    appId: 'am3tzmddp84xrscvpmx7nbtm',
    /** Enable auto-updates for studios: https://www.sanity.io/docs/cli#auto-updates */
    autoUpdates: false,
  },
  schemaExtraction: { enabled: true },
  typegen: {
    enabled: true,
    path: ['./src/**/*.{ts,tsx}', '../web/src/**/*.{ts,tsx}'],
    schema: 'schema.json',
    generates: '../../packages/sanity-types/src/index.ts',
    overloadClientMethods: true,
  },
});
