import { localizedText } from '@hmidmismi/sanity-core';
import { codeInput } from '@sanity/code-input';
import { table } from '@sanity/table';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { media } from 'sanity-plugin-media';
import { muxInput } from 'sanity-plugin-mux-input';
import { LOCALES } from './src/lib/locales';
import { schemaTypes } from './src/schemaTypes';

/** Where the Presentation tool loads the website from. */
const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000';

export default defineConfig({
  name: 'default',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    visionTool(),
    table(),
    codeInput(),
    media(),
    muxInput({
      mp4_support: 'standard',
    }),

    internationalizedArray({
      languages: LOCALES.map(({ code, label }) => ({ id: code, title: label })),
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text', 'portableTextBody', 'portableTextCaption'],
    }),

    presentationTool({
      previewUrl: {
        initial: PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: [PREVIEW_URL, 'http://localhost:*'],
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "page" && count(slug[value.current == $slug]) > 0`,
          },
          { route: '/events/:slug', filter: `_type == "event" && slug.current == $slug` },
          { route: '/people/:slug', filter: `_type == "person" && slug.current == $slug` },
        ]),
        locations: {
          event: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: localizedText(doc.title as never) || 'Event',
                      href: `/events/${doc.slug}`,
                    },
                    { title: 'Events', href: '/events' },
                  ]
                : [],
            }),
          }),
          page: defineLocations({
            select: { title: 'title', slug: 'slug' },
            resolve: (doc) => {
              const slugs = (doc?.slug ?? []) as {
                language?: string;
                value?: { current?: string };
              }[];
              const english = slugs.find((item) => item.language === 'en')?.value?.current;
              return {
                locations: english
                  ? [{ title: localizedText(doc?.title as never) || 'Page', href: `/${english}` }]
                  : [],
              };
            },
          }),
          person: defineLocations({
            select: { name: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: String(doc.name ?? 'Person'), href: `/people/${doc.slug}` }]
                : [],
            }),
          }),
        },
      },
    }),

    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Website')
              .child(
                S.list()
                  .title('Content')
                  .items([
                    S.documentTypeListItem('article').title('Articles'),
                    S.documentTypeListItem('event').title('Events'),
                    S.documentTypeListItem('page').title('Pages'),
                    S.documentTypeListItem('person').title('People'),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem('media.tag').title('Media Tags'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
