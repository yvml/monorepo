// apps/web/src/components/content/ContentModules.tsx
import { Figure, NameList } from '@hmidmismi/ui';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import NextLink from 'next/link';
import { Blocks } from './Blocks';
import { Kicker } from './Kicker';
import { SanityImage } from '@/components/media';
import { localize, localizedBlocks } from '@/i18n';
import type { ContentModule } from '@/lib/sanity';

/**
 * Renders a document's `content` array: text, kickers, lists of people and images, with a caption when an image has one.
 *
 * @param props - the modules.
 * @returns the rendered modules.
 */
export function ContentModules({ modules }: { modules?: ContentModule[] | null }) {
  return (
    <>
      {modules?.map((module) => {
        if (module._type === 'textModule') return <Blocks key={module._key} value={module.text} />;
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
        // An image module with no file yet shows nothing, not the placeholder.
        const picture = (
          <SanityImage
            image={{ url: module.url, width: module.width, height: module.height, alt: module.alt }}
            label=""
            decorative={Boolean(module.decorative)}
            placeholder={false}
          />
        );
        const caption = localizedBlocks(module.caption) as PortableTextBlock[];
        if (!module.url) return null;
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
