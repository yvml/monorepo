import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute';

/**
 * The `data-sanity` attribute that makes an element click-to-edit in the studio's Presentation tool, pointing at one
 * field of a document. Only set in draft mode, so the live site carries no editing markup.
 *
 * @param draft - whether the request is in draft mode.
 * @param id - the document id (a draft prefix is removed).
 * @param type - the document type.
 * @param path - the field to open, such as `price` or `instructors`; the whole document when omitted.
 * @returns the attribute value, or undefined outside draft mode.
 */
export function sanityAttr(draft: boolean, id: string, type: string, path?: string) {
  if (!draft) return undefined;
  return createDataAttribute({ id: id.replace(/^drafts\./, ''), type, path }).toString();
}
