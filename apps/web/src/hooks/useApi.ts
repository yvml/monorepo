// apps/web/src/hooks/useApi.ts
import { useEffect, useState } from 'react';

/**
 * Reads JSON from one of the app's own API routes in the browser, once the page has loaded. For what a cached page cannot
 * hold, such as the weather or what is happening now.
 *
 * @param path - the route, such as `/api/weather`.
 * @returns the data, or null until it arrives and when the request fails.
 */
export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let current = true;
    fetch(path)
      .then((response) => (response.ok ? (response.json() as Promise<T | null>) : null))
      .then((value) => {
        if (current) setData(value);
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [path]);
  return data;
}
