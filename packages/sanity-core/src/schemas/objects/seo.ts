import { defineField, defineType } from 'sanity';
import { localizedText } from '../../lib/i18n';

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;

/**
 * Search and sharing metadata for a page. Each language has its own title and description; the front end falls back
 * to the document's own title and body when a field is empty.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'internationalizedArrayString',
      description: `Shown in search results and browser tabs. Up to ${MAX_TITLE} characters.`,
      validation: (Rule) =>
        Rule.custom((items) =>
          (Array.isArray(items) ? items : []).some(
            (item) =>
              localizedText([item] as never, (item as { language?: string }).language ?? 'en')
                .length > MAX_TITLE
          )
            ? `Keep each title to ${MAX_TITLE} characters or fewer.`
            : true
        ),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'internationalizedArrayText',
      description: `A one or two sentence summary for search results. Up to ${MAX_DESCRIPTION} characters.`,
      validation: (Rule) =>
        Rule.custom((items) =>
          (Array.isArray(items) ? items : []).some(
            (item) => String((item as { value?: string }).value ?? '').length > MAX_DESCRIPTION
          )
            ? `Keep each description to ${MAX_DESCRIPTION} characters or fewer.`
            : true
        ),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image',
      type: 'image',
      description: 'The image shown when the page is shared. 1200 by 630 works best.',
      options: { hotspot: true },
    }),
  ],
});
