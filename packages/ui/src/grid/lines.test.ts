import { describe, expect, it } from 'vitest';
import { createRules, lineMargins, lineRelative, lineShift, measureLine, trim } from './index';

const face = { ascent: 0.9, descent: 0.2, capHeight: 0.7 };
const units = { row: 4, length: (px: number) => `${px}px` };

describe('lines', () => {
  it('puts the baseline half the leftover line height below the top of the line', () => {
    // 16px: ascent 14.4, descent 3.2, so (20 + 14.4 - 3.2) / 2 = 15.6
    const line = measureLine(16, 20, face);
    expect(line.offset).toBeCloseTo(15.6, 5);
    expect(line.cap).toBeCloseTo(11.2, 5);
  });

  it('moves a line with opposite margins so the box keeps its size', () => {
    const line = measureLine(16, 20, face);
    const style = lineShift(line, units) as Record<string, Record<string, string>>;
    // 15.6 is 0.4px under the row line at 16
    expect(Number.parseFloat(style['&::before']?.marginBottom ?? '')).toBeCloseTo(0.4, 5);
    expect(Number.parseFloat(style['&::after']?.marginTop ?? '')).toBeCloseTo(-0.4, 5);
    const margins = lineMargins(line, units) as Record<string, string>;
    expect(Number.parseFloat(margins.marginBlockStart ?? '')).toBeCloseTo(0.4, 5);
    expect(Number.parseFloat(margins.marginBlockEnd ?? '')).toBeCloseTo(-0.4, 5);
    expect(lineRelative(line, units).position).toBe('relative');
  });

  it('writes a baseline that is already on a row as no shift', () => {
    const line = { height: 20, offset: 16, cap: 11 };
    expect(lineMargins(line, units)).toEqual({ marginBlockStart: '0px', marginBlockEnd: '0px' });
  });

  it('trims to the capitals, and rounds up to a row when it snaps', () => {
    const line = measureLine(16, 20, face);
    const plain = trim(line, units, false) as Record<string, Record<string, string>>;
    const snapped = trim(line, units, true) as Record<string, Record<string, string>>;
    // capitals 11.2px: unsnapped 11.2 - 15.6, snapped up to 12 - 15.6
    expect(Number.parseFloat(plain['&::before']?.marginBottom ?? '')).toBeCloseTo(-4.4, 5);
    expect(Number.parseFloat(snapped['&::before']?.marginBottom ?? '')).toBeCloseTo(-3.6, 5);
    expect(Number.parseFloat(snapped['&::after']?.marginTop ?? '')).toBeCloseTo(-4.4, 5);
  });

  it('draws rules as shadows that take no height', () => {
    const rules = createRules({ hairline: '1px', border: '#ccc', edge: '4px' });
    expect(rules.ruleAbove).toEqual({ boxShadow: 'inset 0 1px 0 0 #ccc' });
    expect(rules.ruleBoth.boxShadow).toContain('inset 0 calc(-1 * 1px) 0 0 #ccc');
    expect(JSON.stringify(rules.toneRing(40, 'top'))).toContain('inset 0 4px 0 0 var(--tone)');
    const styles = [
      rules.ruleAbove,
      rules.ruleBelow,
      rules.ruleBoth,
      rules.ringed,
      rules.toneRing(40),
      rules.ruleBelowOf('red'),
    ];
    for (const value of styles)
      expect(JSON.stringify(value)).not.toMatch(/border(Width|Block|Top|Bottom)/);
  });
});
