import { PortableText } from '@portabletext/react';
import { useMemo } from 'react';
import { css } from '../../styled-system/css';
import { htmlToPortableText } from '../rich-text/html-to-portable-text';

/** Props for {@link RichText}. */
export type RichTextProps = {
  /** The HTML (or plain text) to render as Portable Text. */
  html: string;
};

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  lineHeight: 'lg',
  maxWidth: '65ch',
  '& ul, & ol': { paddingInlineStart: '5' },
  '& a': { textDecoration: 'underline' },
});

/**
 * Renders HTML as Portable Text. The HTML is converted to blocks and rendered by `@portabletext/react`, so
 * only the supported formatting reaches the page and unknown tags and unsafe links are dropped.
 *
 * @param props - the HTML to render.
 * @returns the rendered rich text.
 */
export function RichText({ html }: RichTextProps) {
  const value = useMemo(() => htmlToPortableText(html), [html]);
  if (value.length === 0) return null;
  return (
    <div className={wrapper}>
      <PortableText value={value} />
    </div>
  );
}
