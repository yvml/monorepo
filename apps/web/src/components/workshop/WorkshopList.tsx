// apps/web/src/components/workshop/WorkshopList.tsx
import { useMemo } from 'react';
import { Listing } from '@/components/listing';
import { WORKSHOPS } from '@/constants';
import { t } from '@/i18n';
import { workshopListing } from '@/lib/filters';
import { type WorkshopSummary } from '@/lib/sanity';
import { workshopView } from '@/lib/workshop';

/**
 * The workshops listing: `workshopListing` over the workshops.
 *
 * @param props - the workshops and today's date.
 * @returns the page.
 */
export function WorkshopList({ workshops, today }: { workshops: WorkshopSummary[]; today: string }) {
  const context = useMemo(() => ({ today }), [today]);
  return (
    <Listing
      title={t(WORKSHOPS.title)}
      spec={workshopListing}
      basePath={`/${WORKSHOPS.path}`}
      items={workshops}
      context={context}
      item={(workshop) => {
        const view = workshopView(workshop);
        return {
          id: view.id,
          href: view.href,
          title: view.title,
          image: view.image,
          lines: view.lines,
        };
      }}
      empty={t(WORKSHOPS.empty)}
      results={WORKSHOPS.results}
      noMatch={WORKSHOPS.noMatch}
    />
  );
}
