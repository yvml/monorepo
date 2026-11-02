import { personFields, seoField } from '@hmidmismi/sanity-core';
import { defineType } from 'sanity';

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [...personFields(), seoField()],
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
