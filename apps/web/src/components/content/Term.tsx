// apps/web/src/components/content/Term.tsx
import { Pair } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { type TextKey, t } from '@/i18n';

/**
 * One term and its value in a details list. When `attr` is given the value is click-to-edit for the field it comes from
 * in Presentation.
 *
 * @param props - the term's text key, the `data-sanity` attribute of the field the value comes from, and the value.
 * @returns the row.
 */
export function Term({ term, attr, children }: { term: TextKey; attr?: string; children: ReactNode }) {
  return <Pair label={t(term)}>{attr ? <span data-sanity={attr}>{children}</span> : children}</Pair>;
}
