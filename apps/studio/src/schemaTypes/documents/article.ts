import { bodyField, requiredTitleField, seoField } from '@hmidmismi/sanity-core';
import { defineField, defineType } from 'sanity';
import { titlePreview } from '../preview';

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    requiredTitleField(),
    defineField({ name: 'slug', type: 'localizedSlug' }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'textModule' }, { type: 'kickerModule' }, { type: 'imageModule' }, { type: 'peopleModule' }],
    }),
    bodyField(),
    seoField(),
  ],
  preview: titlePreview(),
});
