import { PageTemplate } from '@/components/PageTemplate';
import { withPreviewGate } from '@/lib/gate';
import { getPage, type PageDoc } from '@/lib/pages';

type Props = { page: PageDoc };

/** Static pages from the studio's Page type: `/about`, and nested ones such as `/about/history`. */
export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const parts = context.params?.slug;
  const slug = Array.isArray(parts) ? parts.join('/') : parts;
  if (!slug) return { notFound: true };
  const page = await getPage(slug, draft);
  return page ? { props: { page } } : { notFound: true };
});

export default function StaticPage({ page }: Props) {
  return <PageTemplate page={page} />;
}
