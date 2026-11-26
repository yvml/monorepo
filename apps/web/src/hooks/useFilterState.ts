// apps/web/src/hooks/useFilterState.ts
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { defaultState, type FilterState, type ListSpec, parseUrl, rememberListing, toHref } from '@/lib/filters';

/**
 * The listing's filter state, kept in the address (`/workshops/material/adobe/open?sort=price-low`) so a filtered view can
 * be linked, bookmarked and reloaded, and the back button works. The state is read from the router, which has the
 * address while rendering on the server too, so the first paint already shows the filtered list. A change moves to the new
 * address without running the page's data fetching again, and each deliberate choice is its own history entry; typing in a
 * field replaces the entry instead. The address is also remembered for the visit (see `rememberListing`), so a link to the
 * listing can come back to it filtered.
 *
 * The listing must be served by one optional catch-all page, `[[...path]]`, so every address with these segments reaches it.
 *
 * @param spec - the listing.
 * @param basePath - the listing's own path, such as `/workshops`.
 * @returns the state, a change function, and a reset.
 */
export function useFilterState<T, C>(spec: ListSpec<T, C>, basePath: string) {
  const router = useRouter();
  const { query } = router;
  // Split inside the memo: destructuring `router.query` outside it makes a new object every render, and the state (and
  // everything memoized on it) would be recomputed each time.
  const state = useMemo(() => {
    const { path, ...rest } = query;
    return parseUrl(spec, Array.isArray(path) ? path : path ? [path] : [], rest) ?? defaultState(spec);
  }, [spec, query]);

  // Remember where the listing was left, so a link back to it (the menu, the breadcrumbs) returns to the same filters.
  useEffect(() => rememberListing(basePath, toHref(spec, basePath, state)), [spec, basePath, state]);

  const write = useCallback(
    (next: FilterState, replace: boolean) => {
      const href = toHref(spec, basePath, next);
      void (replace ? router.replace(href, undefined, { shallow: true, scroll: false }) : router.push(href, undefined, { shallow: true, scroll: false }));
    },
    [router, spec, basePath]
  );

  const change = useCallback(
    (update: (old: FilterState) => FilterState, options?: { replace?: boolean }) => write(update(state), options?.replace ?? false),
    [write, state]
  );
  const reset = useCallback(() => write(defaultState(spec), false), [write, spec]);
  return { state, change, reset };
}
