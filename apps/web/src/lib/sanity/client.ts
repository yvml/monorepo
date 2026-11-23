import { createClient } from '@sanity/client';

const base = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
};

/**
 * Published content only, from the CDN. Built on call, so a route that never reads content (the live site's
 * draft-mode routes) does not need a project ID.
 *
 * @returns the published-content client.
 */
export function sanityClient() {
  return createClient({ ...base, useCdn: true });
}

/**
 * Draft content with click-to-edit markers, for the preview site. It needs a Viewer token, so it never runs on the
 * live site.
 *
 * @returns a client that reads drafts from the API host.
 */
export function previewClient() {
  return createClient({
    ...base,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: 'drafts',
    stega: { enabled: true, studioUrl: process.env.SANITY_STUDIO_URL ?? 'http://localhost:3333' },
  });
}

/**
 * The client for a request.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the draft client in draft mode, otherwise the published one.
 */
export function clientFor(draft: boolean) {
  return draft ? previewClient() : sanityClient();
}
