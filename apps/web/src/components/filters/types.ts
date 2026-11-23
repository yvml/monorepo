// apps/web/src/components/filters/types.ts
import type { FilterState } from '@/lib/filters';

/** What a control calls to change the state: a function from the old state to the new one; `replace` for typing, which should not fill the history. */
export type OnChange = (update: (old: FilterState) => FilterState, options?: { replace?: boolean }) => void;
