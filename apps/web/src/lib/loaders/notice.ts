// apps/web/src/lib/loaders/notice.ts
import { PLACE, SECTIONS } from '@/constants';
import { isHappening, localMoment } from '@/lib/dates';
import { getNotice, listHappening, type Localized } from '@/lib/sanity';

/** What the band across the top of the site says: the text in every language, where it leads, and whether it is an editor's notice or the automatic "happening now". */
export type Banner = { kind: 'notice' | 'happening'; text: Localized<string>; href: string | null };

/**
 * Decides what the top band says right now. A notice an editor switched on wins; otherwise the first event, exhibition or
 * workshop that is under way, read in the lab's time zone; otherwise there is no band. It is read in the browser, through
 * `/api/notice`, because the pages are cached and "now" is not.
 *
 * @param now - the moment to decide for.
 * @returns the banner, or null.
 */
export async function bannerLoader(now = new Date()): Promise<Banner | null> {
  const notice = await getNotice(now.toISOString());
  if (notice?.message) return { kind: 'notice', text: notice.message, href: notice.link ?? null };

  const { day, time } = localMoment(now, PLACE.timeZone);
  const entry = (await listHappening(day)).find((item) => isHappening(item, day, time));
  if (!entry?.title) return null;
  const section = SECTIONS.find((item) => item.type === entry.kind);
  return { kind: 'happening', text: entry.title, href: section && entry.slug ? `/${section.path}/${entry.slug}` : null };
}
