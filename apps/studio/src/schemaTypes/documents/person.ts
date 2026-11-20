import { personFields, seoField } from '@hmidmismi/sanity-core';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { createImage } from '../../lib/factories/imageFactory';

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    ...personFields(),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    createImage({ name: 'portrait', title: 'Portrait' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'personLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({ scheme: ['https', 'http', 'mailto'], allowRelative: false }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    seoField(),
  ],
  orderings: [
    {
      title: 'Last name, first name',
      name: 'lastName',
      by: [
        { field: 'familyName', direction: 'asc' },
        { field: 'nameGiven', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      nameGiven: 'nameGiven',
      middleGiven: 'middleGiven',
      familyName: 'familyName',
    },
    prepare: ({ title, nameGiven, middleGiven, familyName }) => ({
      title: [nameGiven, middleGiven, familyName].filter(Boolean).join(' ') || title || 'Unnamed',
    }),
  },
});
