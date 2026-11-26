// apps/web/src/components/home-c/ImpactStats.tsx
import { Cell, Grid, Label, Stack, Surface, Text, VisuallyHidden } from '@hmidmismi/ui';
import { useMemo, useRef } from 'react';
import { useCountSteps } from '@/hooks';

/** `start`, then every `by` after it while below `to`, ending exactly on `to`. */
const counting = (start: number, by: number, to: number) => {
  const steps: number[] = [];
  for (let n = start; n < to; n += by) steps.push(n);
  steps.push(to);
  return steps;
};

/** One figure: an optional eyebrow, the number counting up, and what it counts. */
function Figure({ eyebrow, steps, label, delay }: { eyebrow?: string; steps: number[]; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value] = useCountSteps(ref, steps, delay);
  const final = steps[steps.length - 1] ?? 0;
  return (
    <div ref={ref}>
      <Stack gap="2" align="center">
        {/* Every figure has an eyebrow row, so the numbers sit on one line. */}
        <Label as="div" tone="inherit">
          {eyebrow ?? ' '}
        </Label>
        <Text as="div" face="display" size="7xl" tone="inherit" figures>
          <span aria-hidden>{value.toLocaleString('en-US')}</span>
          <VisuallyHidden>{final.toLocaleString('en-US')}</VisuallyHidden>
        </Text>
        <Text as="div" size="lg" tone="inherit">
          {label}
        </Text>
      </Stack>
    </div>
  );
}

/**
 * The three figures of what YVML has done, in a row, counting up one after another when they come into view.
 *
 * @returns the block.
 */
export function ImpactStats() {
  const workshops = useMemo(() => counting(1, 10, 253), []);
  const people = useMemo(() => [1, ...counting(1000, 1000, 7500)], []);
  const scholarships = useMemo(() => counting(1, 1, 55), []);
  return (
    <Surface as="section" tone="teal" pad="loose" label="Impact">
      <Grid>
        <Cell span="4">
          <Figure steps={workshops} label="workshops" delay={0} />
        </Cell>
        <Cell span="4">
          <Figure eyebrow="Over" steps={people} label="people reached" delay={700} />
        </Cell>
        <Cell span="4">
          <Figure steps={scholarships} label="scholarships awarded" delay={1400} />
        </Cell>
      </Grid>
    </Surface>
  );
}
