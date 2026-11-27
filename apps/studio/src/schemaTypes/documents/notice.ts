// apps/studio/src/schemaTypes/documents/notice.ts
import { localizedText } from '@hmidmismi/sanity-core';
import { defineField, defineType } from 'sanity';

/**
 * A message for the band across the top of the site. While one is active it replaces the automatic "happening now" line
 * (the current workshop or event); when none is, the site goes back to the automatic one. With several active, the most
 * recently edited wins.
 */
export const notice = defineType({
  name: 'notice',
  title: 'Notice',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'active', title: 'Show this notice', type: 'boolean', initialValue: true }),
    defineField({ name: 'startsAt', title: 'Show from', type: 'datetime' }),
    defineField({ name: 'endsAt', title: 'Show until', type: 'datetime' }),
  ],
  preview: {
    select: { message: 'message', active: 'active' },
    prepare: ({ message, active }: { message?: never; active?: boolean }) => ({
      title: localizedText(message) || 'Untitled',
      subtitle: active === false ? 'Hidden' : undefined,
    }),
  },
});
