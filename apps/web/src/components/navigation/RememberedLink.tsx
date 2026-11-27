// apps/web/src/components/navigation/RememberedLink.tsx
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useRememberedHref } from '@/hooks';

/**
 * A link to a route that returns to where the visitor left it: for a filtered listing, the filtered address. Anything else
 * links to its own address.
 *
 * @param props - the link's props, with a plain string address.
 * @returns the link.
 */
export function RememberedLink({ href, ...rest }: Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string }) {
  return <NextLink {...rest} href={useRememberedHref(href)} />;
}
