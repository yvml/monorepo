import { Figure, Measure, NameList, Picture } from '@hmidmismi/ui';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { Kicker } from '@/components/Kicker';
import { localize, localizedBlocks } from '@/lib/localize';
import { PLACEHOLDER } from '@/lib/placeholder';
import { type ContentModule, type ImageData, type LocalizedBlocks } from '@/lib/sanity';

/** Localized Portable Text on its own, such as a workshop description or a biography. */
export function Blocks({ value }: { value?: LocalizedBlocks | null }) {
  const blocks = localizedBlocks(value) as PortableTextBlock[];
  return blocks.length ? (
    <Measure>
      <PortableText value={blocks} />
    </Measure>
  ) : null;
}

/**
 * An image at its own size, or the placeholder when the document has none yet.
 *
 * @param props - the image, a label for when it has no alt text of its own, and whether it only decorates (a card whose title already names it).
 * @returns the picture.
 */
export function Hero({ image, label, decorative = false }: { image?: ImageData; label: string; decorative?: boolean }) {
  const real = image?.url && image.width && image.height ? image : null;
  return (
    <Picture
      shape="photo"
      src={real?.url ?? PLACEHOLDER.url}
      alt={decorative ? '' : (real && localize(real.alt)) || label}
      width={real?.width ?? PLACEHOLDER.width}
      height={real?.height ?? PLACEHOLDER.height}
    />
  );
}

/**
 * Renders a document's `content` array: text modules as Portable Text and image modules as pictures, with a caption
 * when the module has one.
 *
 * @param props - the modules.
 * @returns the rendered modules.
 */
export function ContentModules({ modules }: { modules?: ContentModule[] | null }) {
  return (
    <>
      {modules?.map((module) => {
        if (module._type === 'textModule') {
          const blocks = localizedBlocks(module.text) as PortableTextBlock[];
          return blocks.length ? (
            <Measure key={module._key}>
              <PortableText value={blocks} />
            </Measure>
          ) : null;
        }
        if (module._type === 'kickerModule') {
          const kicker = localize(module.text);
          return kicker ? <Kicker key={module._key}>{kicker}</Kicker> : null;
        }
        if (module._type === 'peopleModule') {
          return (
            <NameList key={module._key}>
                {module.people?.map(({ _key, role, person }) =>
                  person ? (
                    <li key={_key}>
                      {person.linked && person.slug ? (
                        <NextLink href={`/people/${person.slug}`}>{stegaClean(person.title)}</NextLink>
                      ) : (
                        stegaClean(person.title)
                      )}
                      {role ? `, ${role}` : ''}
                    </li>
                  ) : null
                )}
            </NameList>
          );
        }
        if (!module.url || !module.width || !module.height) return null;
        const picture = (
          <Picture
            shape="photo"
            src={module.url}
            alt={module.decorative ? '' : localize(module.alt)}
            width={module.width}
            height={module.height}
          />
        );
        const caption = localizedBlocks(module.caption) as PortableTextBlock[];
        return caption.length ? (
          <Figure key={module._key} caption={<PortableText value={caption} />} credit={module.credit}>
            {picture}
          </Figure>
        ) : (
          <div key={module._key}>{picture}</div>
        );
      })}
    </>
  );
}
