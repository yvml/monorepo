import NextLink from 'next/link';
import { groupForPath } from '@/lib/site';

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
    <nav aria-label={group.title}>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.path}>
            <NextLink
              href={`/${item.path}`}
              aria-current={item.path === path ? 'page' : undefined}
              style={item.path === path ? { fontWeight: 700 } : undefined}
            >
              {item.title}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
