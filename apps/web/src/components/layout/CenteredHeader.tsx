// apps/web/src/components/layout/CenteredHeader.tsx
import { Stack } from '@hmidmismi/ui';
import type { ReactNode } from 'react';

/**
 * The heading block at the top of a page: its lines centered, closed by a hairline rule.
 *
 * @param props - the lines.
 * @returns the header.
 */
export function CenteredHeader({ children }: { children: ReactNode }) {
  return (
    <Stack as="header" gap="4" padBlock="8" align="center" ruled>
      {children}
    </Stack>
  );
}
