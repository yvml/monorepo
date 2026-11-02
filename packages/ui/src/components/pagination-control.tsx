import * as PaginationPrimitive from './pagination';

export function PaginationControl({
  count,
  pageSize,
  page,
  onPageChange,
}: {
  count: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const rootProps = {
    count,
    pageSize,
    page,
    onPageChange: (details: { page: number }) => onPageChange(details.page),
  } as React.ComponentProps<typeof PaginationPrimitive.Root>;

  return (
    <PaginationPrimitive.Root {...rootProps}>
      <PaginationPrimitive.PrevTrigger />
      <PaginationPrimitive.Items render={(p) => <button>{p.value}</button>} />
      <PaginationPrimitive.NextTrigger />
    </PaginationPrimitive.Root>
  );
}
