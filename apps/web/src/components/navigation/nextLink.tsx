// apps/web/src/components/navigation/nextLink.tsx
import type { LinkRender } from '@hmidmismi/ui';
import NextLink from 'next/link';

/**
 * Builds the link renderer the UI package expects from a Next route.
 *
 * @param href - the route.
 * @returns a renderer that gives the link the component's class.
 */
export const nextLink =
  (href: string): LinkRender =>
  (className, content) => (
    <NextLink href={href} className={className}>
      {content}
    </NextLink>
  );
