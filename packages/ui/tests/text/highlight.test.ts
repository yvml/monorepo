import { describe, expect, it } from 'vitest';
import { highlightSegments } from '../../src/text/highlight';

describe('highlightSegments', () => {
  it('marks matches ignoring case and accents, keeping the original text', () => {
    expect(highlightSegments('Thomas Adès', ['ades'])).toEqual([
      { text: 'Thomas ', match: false },
      { text: 'Adès', match: true },
    ]);
  });

  it('marks every token and merges touching hits', () => {
    expect(highlightSegments('Gay Guerrilla', ['gay', 'gu'])).toEqual([
      { text: 'Gay', match: true },
      { text: ' ', match: false },
      { text: 'Gu', match: true },
      { text: 'errilla', match: false },
    ]);
  });

  it('returns the text whole when nothing matches or there are no tokens', () => {
    expect(highlightSegments('Asyla', ['zz'])).toEqual([{ text: 'Asyla', match: false }]);
    expect(highlightSegments('Asyla', [])).toEqual([{ text: 'Asyla', match: false }]);
  });
});
