// src/schemas/arrays/portableTextCaption.ts

import { defineType } from 'sanity';

export const portableTextCaption = defineType({
  name: 'portableTextCaption',
  title: 'Caption',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [],
      },
    },
  ],
});
