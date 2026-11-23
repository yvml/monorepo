import { BrowseNav, browseLinkClass } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { groupForPath } from '@/lib/navigation';
import { t } from '@/lib/text';

/**
 * The links between the pages of a group (About YVML or Support Us), shown on every page inside it.
 *
 * @param props - the current path without the leading slash, such as `about/staff`.
 * @returns the navigation, or nothing when the path is outside both groups.
 */
export function SubNav({ path }: { path: string }) {
  const group = groupForPath(path);
  if (!group) return null;
  const items = [{ title: group.title, path: group.path }, ...group.children];
  return (
    <BrowseNav label={t(group.title)}>
      {items.map((item) => (
        <NextLink
          key={item.path}
          href={`/${item.path}`}
          className={browseLinkClass(item.path === path)}
          aria-current={item.path === path ? 'page' : undefined}
        >
          {t(item.title)}
        </NextLink>
      ))}
    </BrowseNav>
  );
}
