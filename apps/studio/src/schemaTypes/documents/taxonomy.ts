import { localizedText, requiredTitleField } from '@hmidmismi/sanity-core';
import { defineField, defineType } from 'sanity';

/** A taxonomy term: a localized title and a slug. */
const term = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: 'document',
    fields: [
      requiredTitleField({ title }),
      defineField({ name: 'slug', type: 'localizedSlug' }),
    ],
    orderings: [{ title: 'Title', name: 'titleAsc', by: [{ field: 'title[0].value', direction: 'asc' }] }],
    preview: {
      select: { title: 'title' },
      prepare: ({ title }) => ({ title: localizedText(title) || 'Untitled' }),
    },
  });

/** What a workshop is made from: steel, glass, clay. */
export const material = term('material', 'Material');

/** What kind of workshop it is: metalwork, printmaking, professional development. */
export const workshopType = term('workshopType', 'Workshop type');
