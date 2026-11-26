// apps/web/src/lib/filters/remember.ts

/** What a store must offer: the part of `Storage` this file uses. */
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const PREFIX = 'yvml-listing:';

/** The browser's session storage, or null where there is none or it is blocked (a private window, the server). */
const session = (): Store | null => {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Remembers the address a listing was last left at, so a link back to the listing can return to the same filters. The
 * plain address is remembered as nothing. Lasts for the visit (the browser session).
 *
 * @param basePath - the listing's own path, such as `/workshops`.
 * @param href - the listing's current address, with its filters.
 * @param store - where to keep it; the session storage by default.
 */
export function rememberListing(basePath: string, href: string, store: Store | null = session()) {
  if (!store) return;
  try {
    if (href === basePath) store.removeItem(PREFIX + basePath);
    else store.setItem(PREFIX + basePath, href);
  } catch {
    // The filters are simply not remembered.
  }
}

/**
 * The address a listing was last left at.
 *
 * @param basePath - the listing's own path.
 * @param store - where it was kept; the session storage by default.
 * @returns the address with its filters, or null when none is remembered. Only an address inside the listing is returned.
 */
export function recallListing(basePath: string, store: Store | null = session()) {
  if (!store) return null;
  try {
    const href = store.getItem(PREFIX + basePath);
    return href && (href === basePath || href.startsWith(`${basePath}/`) || href.startsWith(`${basePath}?`)) ? href : null;
  } catch {
    return null;
  }
}
