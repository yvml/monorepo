import { BsLink45Deg, BsPalette2 } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';

/** One text color an editor may apply: `value` is the name the front end maps to a color, `hex` only shows the option. */
export type ColorOption = {
  title: string;
  value: string;
  hex: string;
};

type Options = {
  /** Document types a link annotation may point at. Leave empty to offer external links only. */
  internalLinkTypes?: string[];
  /** Text colors an editor may apply. Leave empty to offer none. */
  colors?: ColorOption[];
  /** Other registered types an editor may insert between blocks, such as `table` or `code`. */
  extraTypes?: string[];
};

function internalLinkAnnotation(types: string[]) {
  return defineArrayMember({
    name: 'internalLink',
    type: 'object',
    title: 'Link to a page',
    icon: BsLink45Deg,
    fields: [
      defineField({
        name: 'reference',
        type: 'reference',
        to: types.map((type) => ({ type })),
        validation: (Rule) => Rule.required(),
      }),
    ],
  });
}

function colorAnnotation(colors: ColorOption[]) {
  return defineArrayMember({
    name: 'color',
    type: 'object',
    title: 'Text Color',
    icon: BsPalette2,
    fields: [
      defineField({
        name: 'name',
        title: 'Color',
        type: 'string',
        options: {
          layout: 'radio',
          direction: 'vertical',
          list: colors.map(({ title, value, hex }) => ({
            title: `${title} (${hex})`,
            value,
          })),
        },
      }),
    ],
  });
}

/**
 * The rich-text body. Create it with the document types an internal link may reference, and register the result
 * under the name `portableTextBody`.
 *
 * @param options - the internal link types, the text colors and the extra block types.
 * @returns the array type.
 */
export function createPortableTextBody({
  internalLinkTypes = [],
  colors = [],
  extraTypes = [],
}: Options = {}) {
  return defineType({
    name: 'portableTextBody',
    title: 'Body',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Heading 2', value: 'h2' },
          { title: 'Heading 3', value: 'h3' },
          { title: 'Heading 4', value: 'h4' },
          { title: 'Blockquote', value: 'blockquote' },
        ],
        lists: [
          { title: 'Bullet', value: 'bullet' },
          { title: 'Numbered', value: 'number' },
        ],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
            { title: 'Underline', value: 'underline' },
            { title: 'Strike Through', value: 'strike-through' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({
                  name: 'href',
                  type: 'url',
                  validation: (Rule) =>
                    Rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                }),
                defineField({
                  name: 'blank',
                  title: 'Open in a new tab',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
            },
            ...(internalLinkTypes.length > 0 ? [internalLinkAnnotation(internalLinkTypes)] : []),
            ...(colors.length > 0 ? [colorAnnotation(colors)] : []),
          ],
        },
      }),
      ...extraTypes.map((type) => defineArrayMember({ type })),
    ],
  });
}

/** The default body, with external links only. */
export const portableTextBody = createPortableTextBody();
