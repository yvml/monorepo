// apps/web/src/lib/loaders/home.ts
import { withDraft } from './static';
import { splitByDate, today } from '@/lib/dates';
import { listWorkshops, type WorkshopSummary } from '@/lib/sanity';

/** What the home designs show from the content: the open workshops still to come, soonest first. */
export type HomeProps = { workshops: WorkshopSummary[] };

/** How many workshops a home design gets; the most any of them shows is a feature and a list of eight. */
const COUNT = 9;

/** The loader for the home designs. */
export const homeLoader = withDraft<HomeProps>(async (_context, draft) => {
  const { upcoming } = splitByDate<WorkshopSummary>(await listWorkshops(draft), today());
  return { props: { workshops: upcoming.filter((workshop) => workshop.status !== 'soldOut').slice(0, COUNT) } };
});
