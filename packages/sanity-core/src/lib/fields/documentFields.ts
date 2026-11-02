import { defineField } from 'sanity';
import { localizedTitleField } from './textField';

/** The localized rich-text body shared by pages, articles, events and schedules. */
export const bodyField = () =>
  defineField({ name: 'body', title: 'Body', type: 'internationalizedArrayPortableTextBody' });

/** Search and sharing metadata. */
export const seoField = () => defineField({ name: 'seo', title: 'SEO', type: 'seo' });

/** An event's dates and times. */
export const eventDateField = () =>
  defineField({
    name: 'dateTime',
    title: 'Date and time',
    type: 'flexibleDate',
    validation: (Rule) => Rule.required(),
  });

/** A weekly timetable. The field keeps the name `dateTime` so existing documents stay valid. */
export const weeklyScheduleField = () =>
  defineField({ name: 'dateTime', title: 'Weekly schedule', type: 'flexibleSchedule' });

/** The localized title every content document starts with. */
export const requiredTitleField = (overrides: Record<string, unknown> = {}) =>
  localizedTitleField({
    validation: (Rule: { required: () => unknown }) => Rule.required(),
    ...overrides,
  });
