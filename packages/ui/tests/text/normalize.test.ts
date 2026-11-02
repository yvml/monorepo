import { describe, expect, it } from 'vitest';
import { normalize, tokenize } from '../../src/text/normalize';

describe('normalize and tokenize', () => {
  it('folds accents and case', () => {
    expect(normalize('Thomas Adès')).toBe('thomas ades');
  });

  it('splits on whitespace and drops blanks', () => {
    expect(tokenize('  Julius   EASTMAN ')).toEqual(['julius', 'eastman']);
    expect(tokenize('   ')).toEqual([]);
  });
});
