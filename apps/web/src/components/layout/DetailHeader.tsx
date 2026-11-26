// apps/web/src/components/layout/DetailHeader.tsx
import { Stack, Text, Title } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { CenteredHeader } from './CenteredHeader';

/**
 * The top of a page about one document: its title, then small lines under it (a status, dates, a place), centered.
 *
 * @param props - the title and the lines; empty lines are left out.
 * @returns the header.
 */
export function DetailHeader({ title, lines = [] }: { title: string; lines?: ReactNode[] }) {
  const shown = lines.filter(Boolean);
  return (
    <CenteredHeader>
      <Title level="h1">{title}</Title>
      {shown.length > 0 && (
        <Stack gap="1" align="center">
          {shown.map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
        </Stack>
      )}
    </CenteredHeader>
  );
}
