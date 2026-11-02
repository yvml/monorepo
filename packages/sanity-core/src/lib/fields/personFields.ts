import { defineField } from 'sanity';
import { computedStringInput } from '../components/ComputedStringInput';
import { localizedText } from '../i18n';

/**
 * The fields of a person: name parts, a display name computed from them, a slug and a localized biography. Compose
 * these into a `person` document in the studio.
 */
export const personFields = () => [
  defineField({
    name: 'title',
    title: 'Display name',
    type: 'string',
    description: 'Computed from the given, middle and family names.',
    components: { input: computedStringInput(['nameGiven', 'middleGiven', 'familyName']) },
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    options: {
      source: (doc) => {
        const record = doc as Record<string, unknown>;
        return localizedText(record.title as never) || '';
      },
      maxLength: 96,
    },
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: 'nameGiven', title: 'Given name', type: 'string' }),
  defineField({ name: 'middleGiven', title: 'Middle name', type: 'string' }),
  defineField({ name: 'familyName', title: 'Family name', type: 'string' }),
  defineField({
    name: 'Biography',
    title: 'Biography',
    type: 'internationalizedArrayPortableTextBody',
  }),
];
