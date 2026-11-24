// apps/web/src/components/filters/ToggleControl.tsx
import { Chip } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { withValue } from '@/lib/filters';

/**
 * A chip that turns an on/off filter on or off.
 *
 * @param props - the filter's key, its label, whether it is on, and the change handler.
 * @returns the chip.
 */
export function ToggleControl({ filterKey, label, on, onChange }: { filterKey: string; label: string; on: boolean; onChange: OnChange }) {
  return (
    <Chip pressed={on} onClick={() => onChange((old) => withValue(old, filterKey, !old.values[filterKey]))}>
      {label}
    </Chip>
  );
}
