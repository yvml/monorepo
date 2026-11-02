import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { type Browser, chromium, type Page } from 'playwright-core';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Whether a Chrome is available. The browser tests skip when it is not. */
export const hasChrome = existsSync(CHROME);

const stylesPath = resolve(import.meta.dirname, '../../styled-system/styles.css');

/** Whether the generated stylesheet exists (run `pnpm codegen` first). */
export const hasStyles = existsSync(stylesPath);

/** The generated stylesheet text. */
export const styles = () => readFileSync(stylesPath, 'utf8');

export function launch(): Promise<Browser> {
  return chromium.launch({ executablePath: CHROME, headless: true });
}

/**
 * Opens a blank page with the generated stylesheet and some body markup.
 *
 * @param browser - the browser.
 * @param body - the markup for `<body>`.
 * @param extraCss - CSS added after the stylesheet, such as a theme.
 * @param htmlClass - classes for `<html>`, such as `dark`.
 * @returns the page.
 */
export async function open(
  browser: Browser,
  body: string,
  extraCss = '',
  htmlClass = ''
): Promise<Page> {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  await page.setContent(
    `<!doctype html><html class="${htmlClass}"><head><style>${styles()}</style><style>${extraCss}</style></head><body>${body}</body></html>`
  );
  return page;
}
