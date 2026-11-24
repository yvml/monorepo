// apps/web/src/components/filters/SelectControl.tsx
import { Chip, FilterSet } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { t } from '@/i18n';
import { type CountedOption, withValue } from '@/lib/filters';

/**
 * Chips for a filter with one choice out of several, each with how many items it would leave, and one for no choice.
 *
 * @param props - the filter's key, its label, its choices with counts, the chosen value (empty for none), and the change handler.
 * @returns the chips.
 */
export function SelectControl({ filterKey, label, options, value, onChange }: { filterKey: string; label: string; options: CountedOption[]; value: string; onChange: OnChange }) {
  return (
    <FilterSet label={label}>
      <Chip pressed={value === ''} onClick={() => onChange((old) => withValue(old, filterKey, ''))}>
        {t('availabilityAll')}
      </Chip>
      {options.map((option) => (
        <Chip key={option.value} pressed={value === option.value} onClick={() => onChange((old) => withValue(old, filterKey, option.value))}>
          {`${option.label} (${option.count})`}
        </Chip>
      ))}
    </FilterSet>
  );
}
