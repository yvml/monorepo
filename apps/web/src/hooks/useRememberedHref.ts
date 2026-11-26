// apps/web/src/hooks/useRememberedHref.ts
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { recallListing } from '@/lib/filters';

/**
 * The address a link should go to: the plain one, or, for a listing the visitor has filtered, the address they left it at.
 * The plain address is what the server renders; the remembered one is read in the browser, and again after every
 * navigation, so a link in the menu or the breadcrumbs comes back to the same filters.
 *
 * @param href - the link's plain address.
 * @returns the address to link to.
 */
export function useRememberedHref(href: string) {
  const { asPath } = useRouter();
  const [value, setValue] = useState(href);
  useEffect(() => setValue(recallListing(href) ?? href), [href, asPath]);
  return value;
}
