// apps/web/src/components/layout/Header.tsx
import { Stack, Text, Title, Wrap } from '@hmidmismi/ui';
import type { ReactNode } from 'react';

/**
 * The heading of a page or of a section of one. `start` sets the title at the start of a row with a count, muted, at
 * the end (a listing); `center` centers the title and the small lines under it, closed by a hairline rule (a page
 * about one document).
 *
 * @param props - the title and its level, the alignment, the count (`start`), and the lines (`center`); empty lines are left out.
 * @returns the header.
 */
export function Header({
  title,
  level = 'h1',
  align = 'start',
  count,
  lines = [],
}: {
  title: ReactNode;
  level?: 'h1' | 'h2';
  align?: 'start' | 'center';
  count?: ReactNode;
  lines?: ReactNode[];
}) {
  if (align === 'start') {
    return (
      <Wrap gap="6" justify="between" align="end" after="6">
        <Title level={level}>{title}</Title>
        {count !== undefined && <Text>{count}</Text>}
      </Wrap>
    );
  }
  const shown = lines.filter(Boolean);
  return (
    <Stack as="header" gap="4" padBlock="8" align="center" ruled>
      <Title level={level}>{title}</Title>
      {shown.length > 0 && (
        <Stack gap="1" align="center">
          {shown.map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
