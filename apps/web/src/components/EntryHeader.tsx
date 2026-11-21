// apps/web/src/components/EntryHeader.tsx
import { BreadcrumbTrail, CenteredLines, PageHeader, Title } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { Hero } from '@/components/ContentModules';
import { nextLink } from '@/components/SiteLayout';
import type { Section } from '@/lib/navigation';
import { t } from '@/lib/text';

/**
 * The top of an event, exhibition or workshop page: the trail back to its listing, the title with its status and date
 * lines, and the image. The two page kinds differ below this, in their details and registration.
 *
 * @param props - the section, the entry's id and title, its image, a function that marks a field click-to-edit, and the lines under the title.
 * @returns the header.
 */
export function EntryHeader({
  section,
  id,
  title,
  image,
  attr,
  children,
}: {
  section: Section;
  id: string;
  title: string;
  image: Parameters<typeof Hero>[0]['image'];
  attr: (path?: string) => string | undefined;
  children: ReactNode;
}) {
  return (
    <>
      <BreadcrumbTrail
        home={nextLink('/')}
        steps={[
          { key: section.type, label: t(section.title), link: nextLink(`/${section.path}`) },
          { key: id, label: title, current: true },
        ]}
      />
      <PageHeader>
        <Title level="h1">{title}</Title>
        <CenteredLines>{children}</CenteredLines>
      </PageHeader>
      <div data-sanity={attr('image')}>
        <Hero image={image} label={title} />
      </div>
    </>
  );
}
