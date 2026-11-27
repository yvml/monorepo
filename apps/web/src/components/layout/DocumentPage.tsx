// apps/web/src/components/layout/DocumentPage.tsx
import { PageColumn, Text } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { SanityImage } from '@/components/media';
import { t } from '@/i18n';
import type { ImageData } from '@/lib/sanity';
import { Header } from './Header';
import { Site } from './Site';

/**
 * A page about one document, whatever it is (an article, an event, a person, a workshop, a page written in the studio):
 * the site frame, the breadcrumbs, the centered header with its lines, the image, then what the page adds. When
 * `empty` is set it says the details are to follow.
 *
 * @param props - the title and the small lines under it, the breadcrumbs, the image with its click-to-edit attribute, whether the document has no content yet, and the rest of the page.
 * @returns the page.
 */
export function DocumentPage({
  title,
  lines,
  breadcrumbs,
  image,
  empty = false,
  children,
}: {
  title: string;
  lines?: ReactNode[];
  breadcrumbs?: ReactNode;
  image?: { value?: ImageData; label: string; attr?: string };
  empty?: boolean;
  children?: ReactNode;
}) {
  return (
    <Site title={title}>
      <PageColumn as="article">
        {breadcrumbs}
        <Header align="center" title={title} lines={lines} />
        {image && (
          <div data-sanity={image.attr}>
            <SanityImage image={image.value} label={image.label} />
          </div>
        )}
        {children}
        {empty && <Text>{t('detailsToFollow')}</Text>}
      </PageColumn>
    </Site>
  );
}
