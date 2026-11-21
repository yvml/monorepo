import { PageTemplate } from '@/components/PageTemplate';
import { withPreviewGate } from '@/lib/gate';
import { getPage, type PageDoc } from '@/lib/sanity';

type Props = { page: PageDoc; path: string; draftMode?: boolean };

/** Static pages from the studio's Page type: `/about`, and nested ones such as `/about/history`. */
export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const parts = context.params?.slug;
  const path = Array.isArray(parts) ? parts.join('/') : parts;
  if (!path) return { notFound: true };
  const page = await getPage(path, draft);
  return page ? { props: { page, path } } : { notFound: true };
});

export default function Page({ page, path, draftMode }: Props) {
  return <PageTemplate page={page} path={path} draftMode={draftMode} />;
}
