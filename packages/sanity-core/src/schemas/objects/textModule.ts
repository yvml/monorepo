import { TextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { localizedValue } from '../../lib/i18n';

type Block = { _type?: string; children?: { text?: string }[] };

export const textModule = defineType({
  name: 'textModule',
  title: 'Text Module',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayPortableTextBody',
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare({ text }) {
      const blocks = localizedValue<Block[]>(text, 'en');
      const first = blocks?.find((block) => block._type === 'block');
      const plain = first?.children?.map((child) => child.text ?? '').join('') ?? '';
      return { title: plain || 'Text Module' };
    },
  },
});
