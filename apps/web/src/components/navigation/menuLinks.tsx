// apps/web/src/components/navigation/menuLinks.tsx
import type { LinkRender, NavLink } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { type MenuItem } from '@/constants';
import { t } from '@/i18n';

const isWebAddress = (href: string) => /^https?:\/\//i.test(href);

/**
 * Builds the link renderer for one item. A route uses the router's link. A web address opens in a new tab with
 * `rel="noopener noreferrer"` and an accessible name that says so, so the change of context is announced. `mailto:`,
 * `tel:` and `#` links are plain anchors.
 *
 * @param item - the menu item.
 * @returns the renderer the UI package's header and footer take.
 */
function renderItem(item: MenuItem): LinkRender {
  const external = item.external ?? isWebAddress(item.href);
  if (external) {
    // Read the language when the link renders, not when the menu is built: menus are built once, pages render per language.
    return (className, content) => (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.ariaLabel ?? item.label}, ${t('opensInNewTab')}`}
      >
        {content}
      </a>
    );
  }
  if (item.href.startsWith('/')) {
    return (className, content) => (
      <NextLink href={item.href} className={className} aria-label={item.ariaLabel}>
        {content}
      </NextLink>
    );
  }
  return (className, content) => (
    <a href={item.href} className={className} aria-label={item.ariaLabel}>
      {content}
    </a>
  );
}

/**
 * Turns a list of menu items into the links the site header and footer take. Every menu on the site is built from
 * items through this one function, so links to other sites always open in a new tab with the right `rel` and
 * accessible name.
 *
 * @param items - the menu items, in order.
 * @returns the navigation links.
 */
export const menuLinks = (items: readonly MenuItem[]): NavLink[] =>
  items.map((item) => ({ key: item.key, label: item.label, link: renderItem(item) }));
