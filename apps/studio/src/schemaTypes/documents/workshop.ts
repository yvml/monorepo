import {
  eventDateField,
  localizedText,
  requiredTitleField,
  seoField,
} from '@hmidmismi/sanity-core';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { InstructorsInput } from '../../components/InstructorsInput';
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

const shortDates = (start?: string, end?: string) => {
  if (!start) return undefined;
  const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...options });
  if (!end || end === start) return format(start, { month: 'short', day: 'numeric', year: 'numeric' });
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  return sameMonth
    ? `${format(start, { month: 'short', day: 'numeric' })}–${format(end, { day: 'numeric' })}, ${start.slice(0, 4)}`
    : `${format(start, { month: 'short', day: 'numeric' })} – ${format(end, { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

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
    defineField({
      ...references('instructors', 'Instructors', 'person'),
      components: { input: InstructorsInput },
    }),
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
    keelaUrlField(),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'textModule' }, { type: 'kickerModule' }, { type: 'imageModule' }, { type: 'peopleModule' }],
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
    select: {
      title: 'title',
      date: 'dateTime.entries.0.date',
      endDate: 'dateTime.entries.0.endDate',
      price: 'price',
      status: 'status',
      instructor: 'instructors.0.title',
      media: 'image',
    },
    prepare: ({ title, date, endDate, price, status, instructor, media }) => ({
      title: localizedText(title) || 'Untitled',
      subtitle: [
        shortDates(date, endDate),
        price == null ? undefined : `$${price}`,
        status === 'soldOut' ? 'SOLD OUT' : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
      description: instructor,
      media,
    }),
  },
});
