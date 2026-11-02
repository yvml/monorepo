/**
 * Normalizes text for matching: Unicode decomposition with combining marks removed, then lowercase. `Ådès` and `ades`
 * normalize to the same string, which is what lets a search for `Ades` find `Adès`.
 *
 * @param text - the text.
 * @returns the normalized text.
 */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase();
}

/**
 * Splits a query into normalized tokens on whitespace. A record matches only when every token is found.
 *
 * @param query - what the visitor typed.
 * @returns the tokens, empty when the query is blank.
 */
export function tokenize(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}
