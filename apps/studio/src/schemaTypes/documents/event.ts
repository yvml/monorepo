import {
  bodyField,
  eventDateField,
  localizedText,
  requiredTitleField,
  seoField,
} from '@hmidmismi/sanity-core';
import { defineArrayMember, defineField, defineType } from 'sanity';

const STATUSES = [
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'To be confirmed', value: 'tbc' },
  { title: 'Cancelled', value: 'cancelled' },
];

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    requiredTitleField({ title: 'Event title' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: (doc) => localizedText((doc as { title?: never }).title), maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    eventDateField(),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: STATUSES, layout: 'radio' },
      initialValue: 'scheduled',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where it takes place, such as Brooklyn Aikikai or Wroclaw Aikikai, Poland.',
    }),
    defineField({
      name: 'instructors',
      title: 'Instructors',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'internationalizedArrayText',
      description: 'For example: Saturday only $85, Sunday only $85, both days $160.',
    }),
    defineField({ name: 'registrationUrl', title: 'Registration link', type: 'url' }),
    bodyField(),
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
    select: { title: 'title', date: 'dateTime.entries.0.date', location: 'location' },
    prepare: ({ title, date, location }) => ({
      title: localizedText(title) || 'Untitled',
      subtitle: [date, location].filter(Boolean).join(' · '),
    }),
  },
});
