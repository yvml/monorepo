// apps/web/src/components/navigation/nextLink.tsx
import type { LinkRender } from '@hmidmismi/ui';
import { RememberedLink } from './RememberedLink';

/**
 * Builds the link renderer the UI package expects from a Next route. A listing the visitor has filtered is linked at its filtered address.
 *
 * @param href - the route.
 * @returns a renderer that gives the link the component's class.
 */
export const nextLink =
  (href: string): LinkRender =>
  (className, content) => (
    <RememberedLink href={href} className={className}>
      {content}
    </RememberedLink>
  );
