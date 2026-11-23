/** The generated schema types and per-query result types. They make `client.fetch(QUERY)` return the shape of that query. */
export type * from '@hmidmismi/sanity-types';

import type { FlexibleDate, InternationalizedArrayString, PAGE_QUERY_RESULT } from '@hmidmismi/sanity-types';

/** A localized string field as the studio stores it. A plain string is accepted for fields that are not localized. */
export type Localized<T> = { _key: string; language?: string; value?: T }[] | string | null | undefined;

/** Portable Text, either bare or held per language the way the studio stores localized fields. */
export type LocalizedBlocks = unknown[] | { _key: string; language?: string; value?: unknown[] }[];

/** An image as the `image()` projection returns it. */
export type ImageData = {
  url: string | null;
  width: number | null;
  height: number | null;
  alt?: InternationalizedArrayString | null;
} | null;

/** Anything with the studio's date field: events, workshops, exhibitions. */
export type Dated = { dateTime?: FlexibleDate | null };

/** One module of a document's `content` array, as the `CONTENT` projection returns it. */
export type ContentModule = NonNullable<NonNullable<PAGE_QUERY_RESULT>['content']>[number];
