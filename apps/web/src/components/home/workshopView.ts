// apps/web/src/components/home/workshopView.ts
import { localize } from '@/i18n';
import { formatDates } from '@/lib/dates';
import type { WorkshopSummary } from '@/lib/sanity';

/** A workshop as the home designs show it. Read at render time, so the text follows the page's language. */
export function workshopView(workshop: WorkshopSummary) {
  return {
    id: workshop._id,
    href: `/workshops/${workshop.slug}`,
    title: localize(workshop.title),
    dates: formatDates(workshop),
    material: workshop.materials?.[0] ? localize(workshop.materials[0].title) : '',
    instructor: workshop.instructors?.map((person) => person.title).filter(Boolean).join(', ') ?? '',
    price: workshop.price == null ? '' : `$${workshop.price}`,
    imageUrl: workshop.image?.url ?? null,
  };
}

export type WorkshopView = ReturnType<typeof workshopView>;
