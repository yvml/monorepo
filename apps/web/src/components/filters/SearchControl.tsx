// apps/web/src/components/filters/SearchControl.tsx
import { ListFilter } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { withValue } from '@/lib/filters';

/**
 * A text box for a search filter. Typing replaces the history entry instead of adding one.
 *
 * @param props - the filter's key, its label, its current text and the change handler.
 * @returns the box.
 */
export function SearchControl({ filterKey, label, value, onChange }: { filterKey: string; label: string; value: string; onChange: OnChange }) {
  return (
    <ListFilter
      label={label}
      placeholder={label}
      value={value}
      onChange={(text) => onChange((old) => withValue(old, filterKey, text), { replace: true })}
    />
  );
}
