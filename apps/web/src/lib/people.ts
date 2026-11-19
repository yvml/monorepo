import { type EventSummary, imageQuery, type ImageData, type LocalizedBlocks } from './events';
import { clientFor } from './sanity';

/** A person page: name, location, biography, portrait, links, and the workshops they teach. */
export type PersonDetail = {
  _id: string;
  title?: string;
  location?: string | null;
  portrait?: ImageData;
  biography?: LocalizedBlocks | null;
  links?: { _key: string; label: string; url: string }[];
  workshops?: (EventSummary & { slug: string; price?: number })[];
};

const SLUG = `slug[language == "en" || _key == "en"][0].value.current`;

/**
 * One person by slug, with their workshops.
 *
 * @param slug - the person's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the person, or null.
 */
export function getPerson(slug: string, draft: boolean) {
  return clientFor(draft).fetch<PersonDetail | null>(
    `*[_type == "person" && slug.current == $slug][0]{
      _id, title, location, "portrait": ${imageQuery('portrait')}, "biography": Biography, links,
      "workshops": *[_type == "workshop" && references(^._id) && defined(${SLUG})]
        | order(dateTime.entries[0].date asc){_id, "slug": ${SLUG}, title, status, price, dateTime}
    }`,
    { slug }
  );
}
