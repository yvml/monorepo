import { highlightSegments } from '../text/highlight';

/** Props for {@link Highlight}. */
type HighlightProps = {
  /** The text as displayed. */
  text: string;
  /** The normalized query tokens. */
  tokens: string[];
};

/**
 * Text with the parts that match the query wrapped in `mark`. Matching ignores case and accents; the text is shown as
 * written.
 *
 * @param props - the text and the tokens.
 * @returns the text with marks.
 */
export function Highlight({ text, tokens }: HighlightProps) {
  return (
    <>
      {highlightSegments(text, tokens).map((segment, index) =>
        segment.match ? <mark key={`${index}-${segment.text}`}>{segment.text}</mark> : segment.text
      )}
    </>
  );
}
