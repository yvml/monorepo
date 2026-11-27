// apps/web/src/components/navigation/SubNav.tsx
import { LinkNav, linkNavClass, PageColumn } from '@hmidmismi/ui';
import { useRouter } from 'next/router';
import { groupForPath, routePath } from './path';
import { RememberedLink } from './RememberedLink';
import { t } from '@/i18n';

/**
 * The links between the pages of a group (About YVML or Support Us), shown on every page inside it. The site frame
 * renders it from the address, so no page has to ask for it. The page being read is marked, and so is the group's page
 * it belongs to when it is one level down (an article marks News & Articles).
 *
 * @returns the navigation, or nothing when the address is outside both groups.
 */
export function SubNav() {
  const path = routePath(useRouter().asPath);
  const group = groupForPath(path);
  if (!group) return null;
  const items = [{ title: group.title, path: group.path }, ...group.children];
  const current = items
    .filter((item) => path === item.path || path.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;
  return (
    <PageColumn>
      <LinkNav label={t(group.title)}>
        {items.map((item) => (
          <RememberedLink
            key={item.path}
            href={`/${item.path}`}
            className={linkNavClass(item.path === current)}
            aria-current={item.path === current ? 'page' : undefined}
          >
            {t(item.title)}
          </RememberedLink>
        ))}
      </LinkNav>
    </PageColumn>
  );
}
