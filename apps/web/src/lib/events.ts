import { clientFor } from './sanity';
import type { Section } from './site';

/** A language-keyed array as the studio stores localized fields. */
export type Localized<T> = { _key: string; value?: T }[] | string | null | undefined;

/**
 * Reads one language of a localized field, falling back to English.
 *
 * @param field - the localized array, or a plain string.
 * @param language - the preferred language code.
 * @returns the value, or an empty string.
 */
export function localize(field: Localized<string>, language = 'en') {
  if (typeof field === 'string') return field;
  if (!field) return '';
  return (
    field.find((entry) => entry._key === language)?.value ||
    field.find((entry) => entry._key === 'en')?.value ||
    ''
  );
}

/** One occurrence of an event: ISO dates and 24-hour times in the dojo's local time. */
export type EventEntry = {
  date?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  description?: string;
};

/** The fields a listing row needs. */
export type EventSummary = {
  _id: string;
  slug: string;
  title: Localized<string>;
  status?: 'scheduled' | 'tbc' | 'cancelled' | 'open' | 'soldOut';
  location?: string;
  dateTime?: { circa?: boolean; isRange?: boolean; entries?: EventEntry[] };
};

/** An image as the queries return it. */
export type ImageData = { url: string; width: number; height: number; alt?: Localized<string> } | null;

/** An event or workshop page: the summary plus everything the detail view shows. */
export type EventDetail = EventSummary & {
  instructors?: { _id: string; title?: string; slug?: string }[];
  workshopTypes?: Localized<string>[];
  materials?: Localized<string>[];
  price?: number | null;
  format?: 'inPerson' | 'virtual' | 'hybrid' | null;
  scholarshipAvailable?: boolean | null;
  image?: ImageData;
  body?: LocalizedBlocks | null;
  registrationUrl?: string;
  keelaUrl?: string;
  content?: ContentModule[];
};

/** Portable Text, either bare or held per language the way the studio stores localized fields. */
export type LocalizedBlocks = unknown[] | { _key: string; value?: unknown[] }[];

/** A module from a document's `content` array, shaped by the query. */
export type ContentModule =
  | { _key: string; _type: 'textModule'; text?: LocalizedBlocks }
  | {
      _key: string;
      _type: 'imageModule';
      url?: string;
      width?: number;
      height?: number;
      decorative?: boolean;
      alt?: Localized<string>;
      caption?: LocalizedBlocks;
      credit?: string;
    };

/**
 * Picks one language of localized Portable Text, falling back to English.
 *
 * @param field - bare blocks or the per-language array.
 * @param language - the preferred language code.
 * @returns the blocks, or an empty array.
 */
export function localizedBlocks(field: LocalizedBlocks | null | undefined, language = 'en') {
  const first = field?.[0] as { _key?: string; value?: unknown } | undefined;
  if (!first) return [];
  if (!Array.isArray(first.value)) return field as unknown[];
  const entries = field as { _key: string; value?: unknown[] }[];
  return (entries.find((entry) => entry._key === language) ?? entries.find((entry) => entry._key === 'en') ?? first)
    .value ?? [];
}

/** The GROQ parameters for a section: its document type, and the `type` field filter that only `event` documents have. */
const queryParams = (section: Section) => ({
  docType: section.docType,
  type: section.docType === 'event' ? section.type : '',
});

/** The English slug; each entry keeps one slug per language. */
const SLUG = `slug[language == "en" || _key == "en"][0].value.current`;

const SUMMARY = `_id, "slug": ${SLUG}, title, status, location, dateTime`;
/** GROQ for an image field's asset, dimensions and alt text, as {@link ImageData}. */
export const imageQuery = (field: string) =>
  `${field}{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt }`;

export const CONTENT = `content[]{
  _key, _type,
  _type == "textModule" => { text },
  _type == "imageModule" => {
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "decorative": image.decorative, "alt": image.alt, "caption": image.caption, "credit": image.credit
  }
}`;

const DETAIL = `${SUMMARY}, ${CONTENT}, "image": ${imageQuery('image')},
  "instructors": instructors[]->{_id, title, "slug": slug.current},
  "workshopTypes": workshopTypes[]->title, "materials": materials[]->title,
  price, format, scholarshipAvailable, body, registrationUrl, keelaUrl`;

/**
 * The entries of one type. Entries saved before the `type` field existed count as events.
 *
 * @param section - which listing.
 * @param draft - whether the request is in draft mode.
 * @returns the entries, in no particular order; see {@link splitByDate}.
 */
export function listEntries(section: Section, draft: boolean) {
  return clientFor(draft).fetch<EventSummary[]>(
    `*[_type == $docType && defined(${SLUG}) && ($type == "" || coalesce(type, "event") == $type)]{${SUMMARY}}`,
    queryParams(section)
  );
}

/**
 * One entry by slug and type.
 *
 * @param section - which listing it belongs to.
 * @param slug - the entry's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the entry, or null.
 */
export function getEntry(section: Section, slug: string, draft: boolean) {
  return clientFor(draft).fetch<EventDetail | null>(
    `*[_type == $docType && ${SLUG} == $slug && ($type == "" || coalesce(type, "event") == $type)][0]{${DETAIL}}`,
    { slug, ...queryParams(section) }
  );
}

/** The first date of an entry, or an empty string. */
export const firstDate = (entry: EventSummary) => entry.dateTime?.entries?.[0]?.date ?? '';

/** The last day an entry covers, or an empty string. */
export function lastDate(entry: EventSummary) {
  const entries = entry.dateTime?.entries;
  const last = entry.dateTime?.isRange ? entries?.[0] : entries?.at(-1);
  return last?.endDate ?? last?.date ?? '';
}

/**
 * Splits entries into those still to come (or in progress) and those over.
 *
 * @param entries - the entries.
 * @param today - today as `YYYY-MM-DD`.
 * @returns the upcoming entries soonest first and the past ones latest first.
 */
export function splitByDate(entries: EventSummary[], today: string) {
  const dated = entries.filter((entry) => firstDate(entry));
  const byStart = (a: EventSummary, b: EventSummary) => firstDate(a).localeCompare(firstDate(b));
  return {
    upcoming: dated.filter((entry) => lastDate(entry) >= today).sort(byStart),
    past: dated.filter((entry) => lastDate(entry) < today).sort((a, b) => byStart(b, a)),
    undated: entries.filter((entry) => !firstDate(entry)),
  };
}

const UTC = { timeZone: 'UTC' } as const;
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);

/**
 * The month abbreviation and day for a date block.
 *
 * @param iso - `YYYY-MM-DD`.
 * @returns for example `{ month: 'Oct', day: '14' }`.
 */
export function dateBlock(iso: string) {
  const date = parse(iso);
  return {
    month: date.toLocaleDateString('en-US', { ...UTC, month: 'short' }),
    day: date.toLocaleDateString('en-US', { ...UTC, day: 'numeric' }),
  };
}

/**
 * A readable date or date range, such as `Oct 14, 2026` or `Oct 14 – 16, 2026`.
 *
 * @param entry - the entry.
 * @returns the text, or an empty string when there is no date.
 */
export function formatDates(entry: EventSummary) {
  const start = firstDate(entry);
  if (!start) return '';
  const end = lastDate(entry);
  const full = (iso: string) =>
    parse(iso).toLocaleDateString('en-US', { ...UTC, month: 'short', day: 'numeric', year: 'numeric' });
  const circa = entry.dateTime?.circa ? 'ca. ' : '';
  if (!end || end === start) return circa + full(start);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  const endText = sameMonth ? `${parse(end).getUTCDate()}, ${parse(end).getUTCFullYear()}` : full(end);
  const startText = sameMonth
    ? parse(start).toLocaleDateString('en-US', { ...UTC, month: 'short', day: 'numeric' })
    : full(start);
  return `${circa}${startText} – ${endText}`;
}

/** Today in the dojo's calendar as `YYYY-MM-DD` (UTC is close enough to decide upcoming from past). */
export const today = () => new Date().toISOString().slice(0, 10);
