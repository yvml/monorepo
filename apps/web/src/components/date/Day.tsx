// apps/web/src/components/date/Day.tsx
import { formatDate } from '@/lib/dates';

/**
 * One calendar day, in the page's language, as a `time` element.
 *
 * @param props - the day as `YYYY-MM-DD`.
 * @returns the day.
 */
export function Day({ iso }: { iso: string }) {
  return <time dateTime={iso}>{formatDate(iso)}</time>;
}
