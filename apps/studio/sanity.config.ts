import { localizedText } from '@hmidmismi/sanity-core';
import { codeInput } from '@sanity/code-input';
import { table } from '@sanity/table';
import { visionTool } from '@sanity/vision';
import { studioTheme } from '@sanity/ui';
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

/**
 * Sanity's form fields are spaced with the theme's large space steps, which makes forms with localized fields very
 * tall. Shrinking the steps from index 4 up tightens them; the small steps (padding of buttons and inputs) stay.
 */
const theme = {
  ...studioTheme,
  space: studioTheme.space.map((step: number, index: number) => (index >= 4 ? Math.round(step * 0.7) : step)),
};

export default defineConfig({
  name: 'default',
  theme,
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
          {
            route: '/events/:slug',
            filter: `_type == "event" && count(slug[value.current == $slug]) > 0`,
          },
          {
            route: '/exhibitions/:slug',
            filter: `_type == "event" && type == "exhibition" && count(slug[value.current == $slug]) > 0`,
          },
          {
            route: '/workshops/:slug',
            filter: `_type == "workshop" && count(slug[value.current == $slug]) > 0`,
          },
          { route: '/people/:slug', filter: `_type == "person" && slug.current == $slug` },
        ]),
        locations: {
          event: defineLocations({
            select: { title: 'title', slug: 'slug' },
            resolve: (doc) => {
              const slugs = (doc?.slug ?? []) as { language?: string; value?: { current?: string } }[];
              const english = slugs.find((item) => item.language === 'en')?.value?.current;
              return {
                locations: english
                  ? [
                      {
                        title: localizedText(doc?.title as never) || 'Event',
                        href: `/events/${english}`,
                      },
                      { title: 'Events', href: '/events' },
                    ]
                  : [],
              };
            },
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
          workshop: defineLocations({
            select: { title: 'title', slug: 'slug' },
            resolve: (doc) => {
              const slugs = (doc?.slug ?? []) as { language?: string; value?: { current?: string } }[];
              const english = slugs.find((item) => item.language === 'en')?.value?.current;
              return {
                locations: english
                  ? [
                      {
                        title: localizedText(doc?.title as never) || 'Workshop',
                        href: `/workshops/${english}`,
                      },
                      { title: 'Workshops', href: '/workshops' },
                    ]
                  : [],
              };
            },
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
                    S.documentTypeListItem('workshop').title('Workshops'),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem('workshopType').title('Workshop types'),
            S.documentTypeListItem('material').title('Materials'),
            S.divider(),
            S.documentTypeListItem('media.tag').title('Media Tags'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
