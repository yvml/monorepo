import type { ReactNode } from 'react';

/**
 * The small label above a heading or a list. It follows the design system's eyebrow role: extra small, medium weight,
 * uppercase, wide letter-spacing, in the accent colour.
 *
 * @param props - the label.
 * @returns the kicker.
 */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: '2rem 0 0.25rem',
        color: 'var(--ui-accent)',
        fontFamily: 'var(--ui-font-body)',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        lineHeight: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </p>
  );
}
