import { ImageIcon } from '@sanity/icons/Image';
import { defineType } from 'sanity';
import { createImage } from '../../lib/factories/imageFactory';

export const imageModule = defineType({
  name: 'imageModule',
  title: 'Image Module',
  type: 'object',
  icon: ImageIcon,
  fields: [createImage({ name: 'image', required: true, caption: true })],
  preview: {
    select: { media: 'image' },
    prepare({ media }) {
      return { title: 'Image Module', media };
    },
  },
});
