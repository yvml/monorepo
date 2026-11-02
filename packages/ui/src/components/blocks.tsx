import type { ReactNode } from 'react';
import { codeBlock, disclosure, quote, timeline } from '../../styled-system/recipes';
import { Caption } from './text';

/** Props for {@link Quote}. */
type QuoteProps = {
  /** Where the quote is from. */
  source: string;
  /** The quoted text. */
  children: ReactNode;
};

/**
 * A quoted passage with a bar on its left and its source below. Recipe `quote`.
 *
 * @param props - the source and the quoted text.
 * @returns the quote.
 */
export function Quote({ source, children }: QuoteProps) {
  return (
    <blockquote className={quote()}>
      {children}
      <footer>
        <Caption>{source}</Caption>
      </footer>
    </blockquote>
  );
}

/** Props for {@link CodeBlock}. */
type CodeBlockProps = {
  /** The accessible name. */
  label: string;
  /** The text. */
  children: ReactNode;
};

/**
 * Preformatted monospace text on a tinted surface: citations. Recipe `codeBlock`.
 *
 * @param props - the label and the text.
 * @returns the block.
 */
export function CodeBlock({ label, children }: CodeBlockProps) {
  return (
    <pre className={codeBlock()} aria-label={label}>
      {children}
    </pre>
  );
}

/** Props for {@link Disclosure}. */
type DisclosureProps = {
  /** The text of the always-visible summary. */
  summary: string;
  /** The content shown when opened. */
  children: ReactNode;
};

/**
 * Content hidden behind a summary line until the reader opens it. Recipe `disclosure`.
 *
 * @param props - the summary and the content.
 * @returns the disclosure.
 */
export function Disclosure({ summary, children }: DisclosureProps) {
  return (
    <details className={disclosure()}>
      <summary>{summary}</summary>
      {children}
    </details>
  );
}

/**
 * A vertical timeline: an ordered list with a rail on its left and a dot at each item. Recipe `timeline`.
 *
 * @param props - the `li` items.
 * @returns the timeline.
 */
export function Timeline({ children }: { children: ReactNode }) {
  return <ol className={timeline()}>{children}</ol>;
}
