// apps/web/src/components/filters/ViewControl.tsx
import { Chip, FilterSet } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { t } from '@/i18n';
import type { ListSpec } from '@/lib/filters';

/**
 * Chips that switch how the listing is shown, such as a grid or a list.
 *
 * @param props - the listing's views, the current one, and the change handler.
 * @returns the chips.
 */
export function ViewControl({ views, value, onChange }: { views: NonNullable<ListSpec<unknown, unknown>['views']>; value: string; onChange: OnChange }) {
  return (
    <FilterSet label={t('viewLabel')}>
      {views.map((view) => (
        <Chip key={view.value} pressed={value === view.value} onClick={() => onChange((old) => ({ ...old, view: view.value }))}>
          {t(view.label)}
        </Chip>
      ))}
    </FilterSet>
  );
}
