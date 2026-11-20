import { UsersIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/** A list of people. A kicker and a description above it are their own modules. */
export const peopleModule = defineType({
  name: 'peopleModule',
  title: 'People Module',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'personEntry',
          title: 'Person',
          fields: [
            defineField({
              name: 'person',
              title: 'Person',
              type: 'reference',
              to: [{ type: 'person' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
          ],
          preview: { select: { title: 'person.title', subtitle: 'role' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { people: 'people' },
    prepare: ({ people }) => ({
      title: 'People Module',
      subtitle: `${people?.length ?? 0} people`,
    }),
  },
});
