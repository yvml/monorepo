import { normalize } from './normalize';

/** A run of text, marked when it matched the query. */
export type Segment = { text: string; match: boolean };

/**
 * Splits text into plain and matched runs for highlighting. Matching ignores case and accents, so the original text is
 * kept as written; every token is highlighted wherever it occurs, and overlapping hits merge into one run.
 *
 * @param text - the text as displayed.
 * @param tokens - normalized query tokens (see `tokenize`).
 * @returns the runs in order, covering the whole text.
 */
export function highlightSegments(text: string, tokens: string[]): Segment[] {
  if (tokens.length === 0 || text === '') return [{ text, match: false }];

  /** The normalized text and, for each of its characters, the index of the original character it came from. */
  let folded = '';
  const origin: number[] = [];
  const chars = [...text];
  let position = 0;
  for (const char of chars) {
    const piece = normalize(char);
    for (let unit = 0; unit < piece.length; unit++) origin.push(position);
    folded += piece;
    position += char.length;
  }

  const marked = new Array<boolean>(text.length).fill(false);
  for (const token of tokens) {
    let from = 0;
    for (;;) {
      const at = folded.indexOf(token, from);
      if (at < 0) break;
      const start = origin[at] ?? 0;
      const last = origin[at + token.length - 1] ?? text.length - 1;
      const end = endOfChar(text, last);
      for (let i = start; i < end; i++) marked[i] = true;
      from = at + 1;
    }
  }

  const segments: Segment[] = [];
  for (let i = 0; i < text.length; i++) {
    const match = marked[i] ?? false;
    const previous = segments[segments.length - 1];
    if (previous && previous.match === match) previous.text += text[i];
    else segments.push({ text: text[i] ?? '', match });
  }
  return segments;
}

/**
 * The index just after the character that starts at `index`, so a surrogate pair is never cut in two.
 *
 * @param text - the text.
 * @param index - where a character starts.
 * @returns the end index of that character.
 */
function endOfChar(text: string, index: number): number {
  const code = text.codePointAt(index) ?? 0;
  return index + (code > 0xffff ? 2 : 1);
}
