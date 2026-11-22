// apps/web/src/components/content/Blocks.tsx
import { Measure } from '@hmidmismi/ui';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { localizedBlocks } from '@/lib/localize';
import type { LocalizedBlocks } from '@/lib/sanity';

/**
 * Localized Portable Text in a reading column, such as a workshop description or a biography.
 *
 * @param props - the localized blocks.
 * @returns the text, or nothing when there is none in any language.
 */
export function Blocks({ value }: { value?: LocalizedBlocks | null }) {
  const blocks = localizedBlocks(value) as PortableTextBlock[];
  return blocks.length ? (
    <Measure>
      <PortableText value={blocks} />
    </Measure>
  ) : null;
}
