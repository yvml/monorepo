import { Figure, Measure, Picture } from '@hmidmismi/ui';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { type ContentModule, type ImageData, localize, localizedBlocks, type LocalizedBlocks } from '@/lib/events';

/** Localized Portable Text on its own, such as a workshop description or a biography. */
export function Blocks({ value }: { value?: LocalizedBlocks | null }) {
  const blocks = localizedBlocks(value) as PortableTextBlock[];
  return blocks.length ? (
    <Measure>
      <PortableText value={blocks} />
    </Measure>
  ) : null;
}

/** An image at its own size, or a grey box when the document has none yet. */
export function Hero({ image, label }: { image?: ImageData; label: string }) {
  if (image?.url && image.width && image.height) {
    return <Picture shape="photo" src={image.url} alt={localize(image.alt) || label} width={image.width} height={image.height} />;
  }
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: '4 / 3', background: '#ddd', color: '#777', display: 'grid', placeItems: 'center' }}
    >
      400 × 300
    </div>
  );
}

/**
 * Renders a document's `content` array: text modules as Portable Text and image modules as pictures, with a caption
 * when the module has one.
 *
 * @param props - the modules.
 * @returns the rendered modules.
 */
export function ContentModules({ modules }: { modules?: ContentModule[] }) {
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
        if (module._type === 'peopleModule') {
          return (
            <section key={module._key}>
              {module.kicker && (
                <p style={{ margin: 0, fontSize: '0.8em', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {module.kicker}
                </p>
              )}
              <Blocks value={module.description} />
              <ul>
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
              </ul>
            </section>
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
