// apps/web/src/lib/workshop.ts
import { localize, t } from '@/i18n';
import { formatDates } from '@/lib/dates';
import type { WorkshopSummary } from '@/lib/sanity';

/** A workshop as every listing shows it, the home page and the workshops listing alike. Read at render time, so the text follows the page's language. */
export function workshopView(workshop: WorkshopSummary) {
  const dates = formatDates(workshop);
  const material = workshop.materials?.[0] ? localize(workshop.materials[0].title) : '';
  const instructor = workshop.instructors?.map((person) => person.title).filter(Boolean).join(', ') ?? '';
  const price = workshop.price == null ? '' : `$${workshop.price}`;
  const status = workshop.status === 'soldOut' ? t('soldOut') : '';
  return {
    id: workshop._id,
    href: `/workshops/${workshop.slug}`,
    title: localize(workshop.title),
    dates,
    material,
    instructor,
    price,
    status,
    /** What a listing shows under the title, one line each: the dates, who teaches, and the material, price and status. */
    lines: [dates, instructor, [material, price, status].filter(Boolean).join(' · ')],
    image: workshop.image,
    imageUrl: workshop.image?.url ?? null,
  };
}

export type WorkshopView = ReturnType<typeof workshopView>;
