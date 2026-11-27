// apps/web/src/components/navigation/nextLink.tsx
import type { LinkRender } from '@hmidmismi/ui';
import { RememberedLink } from './RememberedLink';

/**
 * Builds the link renderer the UI package expects from a Next route. A listing the visitor has filtered is linked at its filtered address.
 *
 * @param href - the route.
 * @param ariaLabel - the accessible name, when it should say more than the link's text.
 * @returns a renderer that gives the link the component's class.
 */
export const nextLink =
  (href: string, ariaLabel?: string): LinkRender =>
  (className, content) => (
    <RememberedLink href={href} className={className} aria-label={ariaLabel}>
      {content}
    </RememberedLink>
  );
