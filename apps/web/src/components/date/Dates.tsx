// apps/web/src/components/date/Dates.tsx
import { formatDates } from '@/lib/dates';
import type { Dated } from '@/lib/sanity';

/**
 * The date or date range of an event, exhibition or workshop, in the page's language (`Oct 14 – 16, 2026`, or `ca.` before an approximate one).
 *
 * @param props - the document with a `dateTime` field, and the `data-sanity` attribute that makes it click-to-edit in Presentation.
 * @returns the dates, or nothing when the document has none.
 */
export function Dates({ entry, attr }: { entry: Dated; attr?: string }) {
  const text = formatDates(entry);
  return text ? <span data-sanity={attr}>{text}</span> : null;
}
