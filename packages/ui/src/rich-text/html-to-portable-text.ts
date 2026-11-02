import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
} from '@portabletext/types';
import { parseDocument } from 'htmlparser2';

/**
 * The parts of a parsed HTML node this converter reads. `htmlparser2` nodes satisfy it structurally, which keeps the
 * converter free of a direct dependency on its DOM types.
 */
type HtmlNode = {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: HtmlNode[];
};

/** Tags that start a new block of text. */
const BLOCK_STYLES: Record<string, string> = {
  p: 'normal',
  div: 'normal',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  blockquote: 'blockquote',
};

/** Inline tags that map to a Portable Text decorator. */
const DECORATORS: Record<string, string> = {
  b: 'strong',
  strong: 'strong',
  i: 'em',
  em: 'em',
  u: 'underline',
  code: 'code',
};

/** Link protocols that are safe to render. Anything else is dropped to plain text. */
const SAFE_HREF = /^(https?:|mailto:|\/(?!\/)|#)/i;

/**
 * Converts HTML to Portable Text. It handles paragraphs, headings, block quotes, bullet and numbered lists,
 * line breaks, bold, italic, underline, code and links; any other tag contributes only its text. Unlike
 * `@portabletext/block-tools` it needs no DOM, so it runs on Cloudflare Workers.
 *
 * @param html - the HTML, or plain text.
 * @returns the Portable Text blocks, with empty blocks dropped.
 */
export function htmlToPortableText(html: string): PortableTextBlock[] {
  const root = parseDocument(html) as unknown as HtmlNode;
  const blocks: PortableTextBlock[] = [];
  let counter = 0;
  const key = (): string => `k${counter++}`;

  /**
   * Builds the spans and link definitions for the inline content of one block.
   *
   * @param nodes - the inline nodes.
   * @returns the spans and the link definitions they reference.
   */
  function inline(nodes: HtmlNode[]): {
    children: PortableTextSpan[];
    markDefs: PortableTextMarkDefinition[];
  } {
    const children: PortableTextSpan[] = [];
    const markDefs: PortableTextMarkDefinition[] = [];

    const walk = (list: HtmlNode[], marks: string[]): void => {
      for (const node of list) {
        if (node.type === 'text') {
          const text = (node.data ?? '').replace(/\s+/g, ' ');
          if (text) children.push({ _type: 'span', _key: key(), text, marks });
        } else if (node.type === 'tag') {
          const name = node.name ?? '';
          if (name === 'br') {
            children.push({ _type: 'span', _key: key(), text: '\n', marks });
          } else if (name === 'a' && SAFE_HREF.test(node.attribs?.href ?? '')) {
            const markKey = key();
            markDefs.push({
              _type: 'link',
              _key: markKey,
              href: node.attribs?.href,
            } as PortableTextMarkDefinition);
            walk(node.children ?? [], [...marks, markKey]);
          } else {
            const decorator = DECORATORS[name];
            walk(node.children ?? [], decorator ? [...marks, decorator] : marks);
          }
        }
      }
    };

    walk(nodes, []);
    const first = children[0];
    const last = children[children.length - 1];
    if (first) first.text = first.text.replace(/^\s+/, '');
    if (last) last.text = last.text.replace(/\s+$/, '');
    return { children: children.filter((c) => c.text !== ''), markDefs };
  }

  /**
   * Adds one block built from inline nodes, skipping it when it has no text.
   *
   * @param nodes - the inline nodes.
   * @param style - the block style.
   * @param list - the list type, for list items.
   */
  function pushBlock(nodes: HtmlNode[], style: string, list?: 'bullet' | 'number'): void {
    const { children, markDefs } = inline(nodes);
    if (children.length === 0) return;
    blocks.push({
      _type: 'block',
      _key: key(),
      style,
      children,
      markDefs,
      ...(list ? { listItem: list, level: 1 } : {}),
    });
  }

  /**
   * Walks block-level nodes, grouping loose inline content into paragraphs.
   *
   * @param nodes - the nodes to walk.
   */
  function walkBlocks(nodes: HtmlNode[]): void {
    let loose: HtmlNode[] = [];
    const flush = (): void => {
      pushBlock(loose, 'normal');
      loose = [];
    };

    for (const node of nodes) {
      const name = node.type === 'tag' ? (node.name ?? '') : '';
      if (name === 'ul' || name === 'ol') {
        flush();
        for (const item of node.children ?? []) {
          if (item.type === 'tag' && item.name === 'li') {
            pushBlock(item.children ?? [], 'normal', name === 'ol' ? 'number' : 'bullet');
          }
        }
      } else if (
        name === 'div' &&
        (node.children ?? []).some((c) => c.type === 'tag' && BLOCK_STYLES[c.name ?? ''])
      ) {
        flush();
        walkBlocks(node.children ?? []);
      } else if (BLOCK_STYLES[name]) {
        flush();
        pushBlock(node.children ?? [], BLOCK_STYLES[name]);
      } else {
        loose.push(node);
      }
    }
    flush();
  }

  walkBlocks(root.children ?? []);
  return blocks;
}
