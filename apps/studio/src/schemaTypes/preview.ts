import { localizedText } from '@hmidmismi/sanity-core';

/**
 * A preview that shows a document's localized `title` (English first).
 *
 * @returns the preview config.
 */
export const titlePreview = () => ({
  select: { title: 'title' },
  prepare: ({ title }: { title?: never }) => ({ title: localizedText(title) || 'Untitled' }),
});
