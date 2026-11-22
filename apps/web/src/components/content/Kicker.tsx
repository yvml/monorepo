// apps/web/src/components/content/Kicker.tsx
import { Label } from '@hmidmismi/ui';
import type { ReactNode } from 'react';

/**
 * The small label above a heading or a list, set by the design system's label style.
 *
 * @param props - the label.
 * @returns the kicker.
 */
export function Kicker({ children }: { children: ReactNode }) {
  return <Label as="p">{children}</Label>;
}
