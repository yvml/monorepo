import { localizedText } from '@hmidmismi/sanity-core';
import { TagIcon } from '@sanity/icons/Tag';
import { defineField, defineType } from 'sanity';

/** A short line that sits above a heading or a list: "Board of Directors". */
export const kickerModule = defineType({
  name: 'kickerModule',
  title: 'Kicker Module',
  type: 'object',
  icon: TagIcon,
  fields: [defineField({ name: 'text', title: 'Kicker', type: 'internationalizedArrayString' })],
  preview: {
    select: { text: 'text' },
    prepare: ({ text }) => ({ title: localizedText(text) || 'Kicker Module' }),
  },
});
