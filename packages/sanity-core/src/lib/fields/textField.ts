import { defineField } from 'sanity';

/** A plain string title. */
export const titleField = (overrides: Record<string, unknown> = {}) =>
  defineField({ name: 'title', title: 'Title', type: 'string', ...overrides });

/** A localized title: one string per language. */
export const localizedTitleField = (overrides: Record<string, unknown> = {}) =>
  defineField({
    name: 'title',
    title: 'Title',
    type: 'internationalizedArrayString',
    ...overrides,
  });

/** A multi-line plain text field. */
export const textField = (overrides: Record<string, unknown> = {}) =>
  defineField({ name: 'text', title: 'Text', type: 'text', ...overrides });
