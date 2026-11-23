// apps/web/src/components/filters/FilterSummary.tsx
import { Chip, Text, Wrap } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { t, type TextKey } from '@/i18n';
import type { ActiveFilter } from '@/lib/filters';

/**
 * What sits under a filter bar: the filters that are on as removable chips with one to clear them all, the number of
 * matches, and a line when nothing matches.
 *
 * @param props - the active filters, the change handler, a reset, how many items match and how many there are, and the text keys for the count line and the nothing-matches line.
 * @returns the summary.
 */
export function FilterSummary({
  active,
  onChange,
  onReset,
  shown,
  total,
  resultsKey,
  noMatchKey,
}: {
  active: ActiveFilter[];
  onChange: OnChange;
  onReset: () => void;
  shown: number;
  total: number;
  resultsKey: TextKey;
  noMatchKey: TextKey;
}) {
  return (
    <>
      {active.length > 0 && (
        <Wrap gap="2">
          {active.map((filter) => (
            <Chip key={filter.id} removable label={t('removeFilter', { name: filter.label })} onClick={() => onChange(filter.remove)}>
              {filter.label}
            </Chip>
          ))}
          <Chip onClick={onReset}>{t('clearFilters')}</Chip>
        </Wrap>
      )}
      <div aria-live="polite">
        <Text>{t(resultsKey, { shown, total })}</Text>
      </div>
      {shown === 0 && <Text>{t(noMatchKey)}</Text>}
    </>
  );
}
