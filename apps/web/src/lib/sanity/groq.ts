/**
 * GROQ fragments. Every query is composed from these, so a path such as the localized slug is written once. A fragment
 * is a projection body or an expression, never a whole query; the fetch helpers in `./fetch` build the query around it.
 */

/** The English slug; each document keeps one slug per language. */
export const SLUG = `slug[language == "en" || _key == "en"][0].value.current`;

/** The slug of a document whose slug is not localized, such as a person. */
export const SLUG_PLAIN = `slug.current`;

/** A person's name with prefix and suffix: `Dr. Nicole Panter Dailey`, `Henry Smith IV`. */
export const FULL_NAME = `array::join(array::compact([prefix, title, suffix]), " ")`;

/**
 * An image field as `{ url, width, height, alt }`.
 *
 * @param field - the field name.
 * @returns the projection.
 */
export const image = (field: string) =>
  `${field}{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt }`;

/** The fields a listing row needs. */
export const SUMMARY = `_id, _type, "slug": ${SLUG}, title, status, location, dateTime`;

/** A person as a link target inside another document: their name and whether they have a page worth linking to. */
export const PERSON_LINK = `_id, "title": ${FULL_NAME}, "slug": ${SLUG_PLAIN}, "linked": defined(Biography) || defined(portrait.asset)`;

/** The `content` array's modules. */
export const CONTENT = `content[]{
  _key, _type,
  _type == "textModule" => { text },
  _type == "kickerModule" => { text },
  _type == "peopleModule" => {
    "people": people[]{ _key, role, "person": person->{ ${PERSON_LINK} } }
  },
  _type == "imageModule" => {
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "decorative": image.decorative, "alt": image.alt, "caption": image.caption, "credit": image.credit
  }
}`;
