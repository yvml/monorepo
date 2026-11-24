// apps/web/src/lib/sorts/price.ts
import { byDate } from './date';
import type { Dated } from '@/lib/sanity';

/**
 * Orders by price, then by date. Entries with no price sort last in both directions.
 *
 * @param direction - 1 for cheapest first, -1 for dearest first.
 * @returns a comparator.
 */
export const byPrice =
  (direction: 1 | -1) =>
  <T extends Dated & { price?: number | null }>(a: T, b: T) => {
    if (a.price == null || b.price == null) return Number(a.price == null) - Number(b.price == null);
    return (a.price - b.price) * direction || byDate(a, b);
  };
