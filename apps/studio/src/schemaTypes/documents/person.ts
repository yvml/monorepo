import { personFields, seoField } from '@hmidmismi/sanity-core';
import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity';
import { createImage } from '../../lib/factories/imageFactory';

const prefix = defineField({ name: 'prefix', title: 'Prefix', type: 'string' });
const suffix = defineField({ name: 'suffix', title: 'Suffix', type: 'string' });

/** The shared name fields with a prefix (Dr.) before the given name and a suffix (IV, PhD) after the family name. */
const nameFields = (personFields() as FieldDefinition[]).flatMap((field): FieldDefinition[] => {
  if (field.name === 'nameGiven') return [prefix, field];
  if (field.name === 'familyName') return [field, suffix];
  return [field];
});

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    ...nameFields,
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
      prefix: 'prefix',
      nameGiven: 'nameGiven',
      middleGiven: 'middleGiven',
      familyName: 'familyName',
      suffix: 'suffix',
    },
    prepare: ({ title, prefix, nameGiven, middleGiven, familyName, suffix }) => ({
      title:
        [prefix, nameGiven, middleGiven, familyName, suffix].filter(Boolean).join(' ') || title || 'Unnamed',
    }),
  },
});
