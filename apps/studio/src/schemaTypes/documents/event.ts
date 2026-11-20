import {
  eventDateField,
  localizedText,
  requiredTitleField,
  seoField,
} from '@hmidmismi/sanity-core';
import { defineField, defineType } from 'sanity';
import { createImage } from '../../lib/factories/imageFactory';
import { keelaUrlField } from '../keelaUrlField';

const STATUSES = [
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'To be confirmed', value: 'tbc' },
  { title: 'Cancelled', value: 'cancelled' },
];

const TYPES = [
  { title: 'Event', value: 'event' },
  { title: 'Exhibition', value: 'exhibition' },
];

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    requiredTitleField({ title: 'Event title' }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: TYPES, layout: 'radio' },
      initialValue: 'event',
    }),
    defineField({ name: 'slug', type: 'localizedSlug' }),
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
    }),
    createImage({ name: 'image', title: 'Image' }),
    defineField({ name: 'registrationUrl', title: 'Registration link', type: 'url' }),
    keelaUrlField(),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'imageModule' }, { type: 'textModule' }, { type: 'peopleModule' }],
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
