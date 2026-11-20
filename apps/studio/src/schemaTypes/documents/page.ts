import { requiredTitleField, seoField } from '@hmidmismi/sanity-core';
import { defineField, defineType } from 'sanity';
import { titlePreview } from '../preview';

/** A free-standing page, such as About or History. Its slug may contain slashes for nested paths (`about/history`). */
export const page = defineType({
  name: 'page',
  title: 'Page',
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
    seoField(),
  ],
  preview: titlePreview(),
});
