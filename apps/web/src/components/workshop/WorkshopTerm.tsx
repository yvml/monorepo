// apps/web/src/components/workshop/WorkshopTerm.tsx
import { TermRow } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { type TextKey, t } from '@/i18n';

/**
 * One row of a workshop's details: a term and its value, which is click-to-edit for the field it comes from in Presentation.
 *
 * @param props - the term's text key, the workshop field the value comes from, the function that makes a field editable, and the value.
 * @returns the row.
 */
export function WorkshopTerm({ term, field, attr, children }: { term: TextKey; field: string; attr: (path: string) => string | undefined; children: ReactNode }) {
  return (
    <TermRow term={t(term)}>
      <span data-sanity={attr(field)}>{children}</span>
    </TermRow>
  );
}
