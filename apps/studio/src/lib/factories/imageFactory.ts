import { defineField } from 'sanity';

const LICENSE_OPTIONS = [
  { title: 'All Rights Reserved', value: 'all-rights-reserved' },
  { title: 'CC BY', value: 'cc-by' },
  { title: 'CC BY-SA', value: 'cc-by-sa' },
  { title: 'CC BY-NC', value: 'cc-by-nc' },
  { title: 'Public Domain', value: 'public-domain' },
];

interface ImageFieldOptions {
  name?: string;
  title?: string;
  required?: boolean;
  caption?: boolean;
}

export const createImage = ({
  name = 'image',
  title = 'Image',
  required = false,
}: ImageFieldOptions = {}) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    validation: (Rule) => (required ? Rule.required() : Rule),
    fields: [
      defineField({
        name: 'decorative',
        title: 'Decorative',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'internationalizedArrayString',
        hidden: ({ parent }) => !!parent?.decorative,
      }),
      defineField({
        name: 'credit',
        title: 'Credit',
        type: 'string',
      }),
      defineField({
        name: 'license',
        title: 'License',
        type: 'string',
        options: { list: LICENSE_OPTIONS, layout: 'dropdown' },
      }),
      defineField({
        name: 'caption',
        title: 'Caption',
        type: 'internationalizedArrayPortableTextCaption',
      }),
    ],
  });
