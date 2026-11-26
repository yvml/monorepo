// apps/web/src/components/media/ImageGrid.tsx
import { Cell, Grid, Stack, Text } from '@hmidmismi/ui';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import type { ImageData } from '@/lib/sanity';
import { SanityImage } from './SanityImage';

/** One card of an {@link ImageGrid}. */
export type ImageGridItem = {
  id: string;
  href: string;
  title: string;
  image?: ImageData;
  /** The small lines under the title; empty ones are left out. */
  lines: ReactNode[];
};

/**
 * Items as a grid of cards: the image and title as one link, then small lines. Every listing's grid view is this, so they
 * cannot drift apart.
 *
 * @param props - the items.
 * @returns the grid.
 */
export function ImageGrid({ items }: { items: ImageGridItem[] }) {
  return (
    <Grid>
      {items.map((item) => (
        <Cell key={item.id} span="3">
          <Stack gap="1">
            <NextLink href={item.href}>
              <SanityImage image={item.image} label={item.title} decorative />
              {item.title}
            </NextLink>
            {item.lines.filter(Boolean).map((line, index) => (
              <Text key={index} variant="small">
                {line}
              </Text>
            ))}
          </Stack>
        </Cell>
      ))}
    </Grid>
  );
}
