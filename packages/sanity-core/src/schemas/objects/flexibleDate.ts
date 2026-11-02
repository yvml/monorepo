import { defineArrayMember, defineField, defineType } from 'sanity';
import { FlexibleDateInput } from '../../lib/components/FlexibleDateInput';
import { isoDate, notBefore, timeOfDay } from '../../lib/validation';

/**
 * Dates and times for an event or a life date. In range mode only the first entry is used, with `date` and `endDate`;
 * otherwise each entry is a separate occurrence. Dates are ISO strings (`YYYY-MM-DD`) and times are 24-hour `HH:mm`
 * in the dojo's local time, so they are stored as strings rather than datetimes.
 */
export const flexibleDate = defineType({
  name: 'flexibleDate',
  title: 'Date',
  type: 'object',
  components: { input: FlexibleDateInput },
  fields: [
    defineField({ name: 'circa', type: 'boolean' }),
    defineField({ name: 'isRange', type: 'boolean' }),
    defineField({
      name: 'entries',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              type: 'string',
              validation: (Rule) => Rule.required().custom(isoDate).error('Choose a date.'),
            }),
            defineField({
              name: 'endDate',
              type: 'string',
              validation: (Rule) =>
                Rule.custom(isoDate).custom(
                  notBefore('date', 'The end date is before the start date.')
                ),
            }),
            defineField({
              name: 'startTime',
              type: 'string',
              validation: (Rule) => Rule.custom(timeOfDay),
            }),
            defineField({
              name: 'endTime',
              type: 'string',
              validation: (Rule) =>
                Rule.custom(timeOfDay).custom(
                  notBefore('startTime', 'The end time is before the start time.')
                ),
            }),
            defineField({ name: 'allDay', type: 'boolean' }),
            defineField({ name: 'description', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { entries: 'entries', circa: 'circa', isRange: 'isRange' },
    prepare({
      entries,
      circa,
      isRange,
    }: {
      entries?: { date?: string; endDate?: string }[];
      circa?: boolean;
      isRange?: boolean;
    }) {
      const first = entries?.[0];
      if (!first?.date) return { title: 'No date' };
      const format = (value: string) =>
        new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      const suffix = isRange && first.endDate ? `–${format(first.endDate)}` : '';
      return { title: `${circa ? 'ca. ' : ''}${format(first.date)}${suffix}` };
    },
  },
});
