import { bodyField, requiredTitleField, weeklyScheduleField } from '@hmidmismi/sanity-core';
import { defineType } from 'sanity';
import { titlePreview } from '../preview';

/** A weekly timetable, such as the adult classes or the kids' classes. */
export const schedule = defineType({
  name: 'schedule',
  title: 'Schedule',
  type: 'document',
  fields: [requiredTitleField({ title: 'Name' }), weeklyScheduleField(), bodyField()],
  preview: titlePreview(),
});
