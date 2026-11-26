// apps/web/src/components/layout/TitleRow.tsx
import { Text, Title, Wrap } from '@hmidmismi/ui';
import type { ReactNode } from 'react';

/**
 * The title of a listing at the start of a row, and its count, muted, at the end.
 *
 * @param props - the title, and the count when the page shows one.
 * @returns the row.
 */
export function TitleRow({ title, count }: { title: ReactNode; count?: ReactNode }) {
  return (
    <Wrap gap="6" justify="between" align="end" after="6">
      <Title level="h1">{title}</Title>
      {count !== undefined && <Text>{count}</Text>}
    </Wrap>
  );
}
