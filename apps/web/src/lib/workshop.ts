// apps/web/src/lib/workshop.ts
import { localize, t } from '@/i18n';
import { formatDates } from '@/lib/dates';
import type { WorkshopSummary } from '@/lib/sanity';

/** A workshop as every listing shows it, the home page and the workshops listing alike. Read at render time, so the text follows the page's language. */
export function workshopView(workshop: WorkshopSummary) {
  return {
    id: workshop._id,
    href: `/workshops/${workshop.slug}`,
    title: localize(workshop.title),
    dates: formatDates(workshop),
    material: workshop.materials?.[0] ? localize(workshop.materials[0].title) : '',
    instructor: workshop.instructors?.map((person) => person.title).filter(Boolean).join(', ') ?? '',
    price: workshop.price == null ? '' : `$${workshop.price}`,
    status: workshop.status === 'soldOut' ? t('soldOut') : '',
    image: workshop.image,
    imageUrl: workshop.image?.url ?? null,
  };
}

export type WorkshopView = ReturnType<typeof workshopView>;
