// apps/web/src/pages/[...slug].tsx
import { Page } from '@/components/layout';
import { type PageProps, onDemandPaths, pageLoader } from '@/lib/loaders';

/** Pages from the studio's Page type: `/about`, and nested ones such as `/about/history`. */
export const getStaticPaths = onDemandPaths;

export const getStaticProps = pageLoader();

export default function StaticPage({ page, draftMode }: PageProps) {
  return <Page page={page} draftMode={draftMode} />;
}
