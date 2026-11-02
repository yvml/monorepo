import type { Theme } from './types';

/** One `@font-face` rule as Panda's `globalFontface` takes it. */
type FaceRule = {
  src: string;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  fontDisplay: 'swap';
};

/** The CSS `format()` of a font file, from its extension. */
const formatOf = (file: string) =>
  file.endsWith('.woff2') ? 'woff2' : file.endsWith('.woff') ? 'woff' : 'truetype';

/**
 * The `@font-face` rules for the files a theme's faces declare, in the shape Panda's `globalFontface` takes. Each family
 * is declared once with all its weights and styles, so `font-weight` and `font-style` pick the file; a family two roles
 * share is declared once. A framework with its own font loader (`next/font`) leaves `files` out and never calls this.
 *
 * @param theme - the theme whose faces list their files.
 * @param url - where a file is served from: the URL to write for a file name, relative to the generated stylesheet.
 * @returns the rules by family, ready for `globalFontface`.
 */
export function fontFaces(theme: Theme, url: (file: string) => string): Record<string, FaceRule[]> {
  const rules: Record<string, FaceRule[]> = {};
  for (const face of Object.values(theme.faces)) {
    if (!face.files || rules[face.family]) continue;
    rules[face.family] = face.files.map(({ file, weight, style = 'normal' }) => ({
      src: `url(${url(file)}) format("${formatOf(file)}")`,
      fontWeight: weight,
      fontStyle: style,
      fontDisplay: 'swap',
    }));
  }
  return rules;
}
