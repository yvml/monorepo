// apps/web/src/components/navigation/Breadcrumbs.tsx
import { BreadcrumbTrail } from '@hmidmismi/ui';
import { nextLink } from './nextLink';
import type { Section } from '@/lib/navigation';
import { t } from '@/lib/text';

/**
 * The trail from the home page through a section's listing to the page being read.
 *
 * @param props - the section (events, exhibitions or workshops), the page's id, and its title.
 * @returns the trail.
 */
export function Breadcrumbs({ section, id, title }: { section: Section; id: string; title: string }) {
  return (
    <BreadcrumbTrail
      home={nextLink('/')}
      steps={[
        { key: section.type, label: t(section.title), link: nextLink(`/${section.path}`) },
        { key: id, label: title, current: true },
      ]}
    />
  );
}
