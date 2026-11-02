import { defineArrayMember, defineField, defineType } from 'sanity';
import { FlexibleScheduleInput } from '../../lib/components/FlexibleScheduleInput';
import { notBefore, timeOfDay } from '../../lib/validation';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
  (value) => ({
    title: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  })
);

/**
 * A weekly timetable: for each day, a list of labeled time slots. Days are stored as lowercase English keys and
 * localized by the front end; times are 24-hour `HH:mm`.
 */
export const flexibleSchedule = defineType({
  name: 'flexibleSchedule',
  title: 'Schedule',
  type: 'object',
  components: { input: FlexibleScheduleInput },
  fields: [
    defineField({
      name: 'schedule',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              type: 'string',
              options: { list: DAYS },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'entries',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'startTime',
                      type: 'string',
                      validation: (Rule) => Rule.required().custom(timeOfDay),
                    }),
                    defineField({
                      name: 'endTime',
                      type: 'string',
                      validation: (Rule) =>
                        Rule.custom(timeOfDay).custom(
                          notBefore('startTime', 'The end time is before the start time.')
                        ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { schedule: 'schedule' },
    prepare({ schedule }: { schedule?: { day?: string; entries?: unknown[] }[] }) {
      const total = schedule?.reduce((count, day) => count + (day.entries?.length ?? 0), 0) ?? 0;
      const days = schedule
        ?.filter((day) => (day.entries?.length ?? 0) > 0)
        .map((day) => day.day)
        .join(', ');
      return { title: days ? `Schedule: ${days}` : 'Empty schedule', subtitle: `${total} entries` };
    },
  },
});
