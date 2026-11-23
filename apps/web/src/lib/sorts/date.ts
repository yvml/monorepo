// apps/web/src/lib/sorts/date.ts
import { firstDate } from '@/lib/dates';
import type { Dated } from '@/lib/sanity';

/** Orders by the first date, soonest first. An entry with no date sorts before the dated ones. */
export const byDate = (a: Dated, b: Dated) => firstDate(a).localeCompare(firstDate(b));
