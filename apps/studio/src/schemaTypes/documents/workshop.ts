import {
  bodyField,
  eventDateField,
  localizedText,
  requiredTitleField,
  seoField,
} from '@hmidmismi/sanity-core';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { createImage } from '../../lib/factories/imageFactory';
import { keelaUrlField } from '../keelaUrlField';

const FORMATS = [
  { title: 'In person', value: 'inPerson' },
  { title: 'Virtual', value: 'virtual' },
  { title: 'Hybrid', value: 'hybrid' },
];

const STATUSES = [
  { title: 'Open', value: 'open' },
  { title: 'Sold out', value: 'soldOut' },
];

const references = (name: string, title: string, to: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: to }] })],
  });

/** A workshop: a title, when it takes place, what it teaches and is made from, the Keela registration form, and content built from modules. */
export const workshop = defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    requiredTitleField({ title: 'Workshop title' }),
    defineField({ name: 'slug', type: 'localizedSlug' }),
    eventDateField(),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: { list: FORMATS, layout: 'radio' },
      initialValue: 'inPerson',
    }),
    references('instructors', 'Instructors', 'person'),
    references('workshopTypes', 'Workshop types', 'workshopType'),
    references('materials', 'Materials', 'material'),
    defineField({ name: 'price', title: 'Price (USD)', type: 'number', validation: (Rule) => Rule.min(0) }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: STATUSES, layout: 'radio' },
      initialValue: 'open',
    }),
    defineField({ name: 'scholarshipAvailable', title: 'Full scholarship available', type: 'boolean' }),
    createImage({ name: 'image', title: 'Image' }),
    bodyField(),
    keelaUrlField(),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'imageModule' }, { type: 'textModule' }],
    }),
    seoField(),
  ],
  orderings: [
    {
      title: 'Date, soonest first',
      name: 'dateAsc',
      by: [{ field: 'dateTime.entries[0].date', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'dateTime.entries.0.date', media: 'image' },
    prepare: ({ title, date, media }) => ({
      title: localizedText(title) || 'Untitled',
      subtitle: date,
      media,
    }),
  },
});
